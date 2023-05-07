/* eslint-disable no-console */
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { Request, Response } from "express";
import configuration from "../../../../core/config/configuration";
import { KJUR } from "jsrsasign";
import { ZoomMeetingRole } from "../../class-room/enums/zoom-meeting-role.enum";
import {
    PaginatedZoomResponse,
    ZakTokenResponse,
    ZoomCreateMeetingResponse,
    ZoomMeeting,
    ZoomTokenResponse,
    ZoomUser,
} from "../interfaces/zoom.interfaces";
import { CustomHttpService } from "../../../../core/services/custom-http.service";
import { RedisCacheService } from "../../../../modules/cache/services/redis-cache.service";
import { ZoomErrors } from "../../class-room/responses/zoom.error.responses";
import { createHmac } from "crypto";
import { GenerateTokenDto } from "../dtos/generate-token.dto";
import { LoggerService } from "../../../../core/services";

@Injectable()
export class ZoomService {
    constructor(private readonly http: CustomHttpService, private readonly cacheService: RedisCacheService) {}

    get base64EncodedToken(): string {
        const { clientId, clientSecret } = configuration().zoom;
        return Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
    }

    async generateToken(userId: number, generateTokenDto: GenerateTokenDto): Promise<boolean> {
        try {
            const res = await this.http.post<ZoomTokenResponse>(
                configuration().zoom.urls.accessToken,
                {
                    code: generateTokenDto.code,
                    grant_type: "authorization_code",
                    redirect_uri: generateTokenDto.redirectUri,
                },
                {
                    headers: {
                        Authorization: `Basic ${this.base64EncodedToken}`,
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                },
            );
            await this.cacheService.setUserData(userId, "access_token", res.access_token);
            await this.cacheService.setUserData(userId, "refresh_token", res.refresh_token);
            await this.cacheService.setUserData(userId, "expires_in", res.expires_in);
            await this.cacheService.setUserData(userId, "scope", res.scope);
            return true;
        } catch (e) {
            console.log(e);
            throw new UnauthorizedException(ZoomErrors.ZOOM_401_UNAUTHORIZED);
        }
    }

    async refreshToken(userId: number): Promise<boolean> {
        try {
            const refreshToken = await this.cacheService.getUserData<string>(userId, "refresh_token");
            const res: ZoomTokenResponse = await this.http.post(
                configuration().zoom.urls.accessToken,
                {
                    grant_type: "refresh_token",
                    refresh_token: refreshToken,
                },
                {
                    headers: {
                        Authorization: `Basic ${this.base64EncodedToken}`,
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                },
            );
            await this.cacheService.setUserData(userId, "access_token", res.access_token);
            await this.cacheService.setUserData(userId, "refresh_token", res.refresh_token);
            await this.cacheService.setUserData(userId, "expires_in", res.expires_in);
            await this.cacheService.setUserData(userId, "scope", res.scope);
            return true;
        } catch (e) {
            throw new UnauthorizedException(ZoomErrors.ZOOM_401_UNAUTHORIZED);
        }
    }

    async getZoomUser(userId: number): Promise<ZoomUser> {
        try {
            const accessToken = await this.cacheService.getUserData<string>(userId, "access_token");
            if (!accessToken) {
                return Promise.reject(new UnauthorizedException(ZoomErrors.ZOOM_401_UNAUTHORIZED));
            }
            return await this.http.get<ZoomUser>(configuration().zoom.urls.userProfile, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
        } catch (e) {
            if (e instanceof UnauthorizedException) {
                await this.refreshToken(userId);
                return await this.getZoomUser(userId);
            }
            throw e;
        }
    }

    async createMeeting(userId: number, topic?: string): Promise<ZoomCreateMeetingResponse> {
        try {
            const accessToken = await this.cacheService.getUserData<string>(userId, "access_token");
            if (!accessToken) {
                return Promise.reject(new UnauthorizedException(ZoomErrors.ZOOM_401_UNAUTHORIZED));
            }
            return await this.http.post<ZoomCreateMeetingResponse>(
                `${configuration().zoom.urls.userProfile}/meetings`,
                { topic },
                {
                    headers: { Authorization: `Bearer ${accessToken}` },
                },
            );
        } catch (e) {
            if (e instanceof UnauthorizedException) {
                await this.refreshToken(userId);
                return await this.createMeeting(userId, topic);
            }
            throw e;
        }
    }

    async getMeeting(userId: number): Promise<PaginatedZoomResponse<ZoomMeeting>>;

    async getMeeting(userId: number, id: number): Promise<ZoomMeeting>;

    async getMeeting(userId: number, id?: number): Promise<ZoomMeeting | PaginatedZoomResponse<ZoomMeeting>> {
        try {
            const accessToken = await this.cacheService.getUserData<string>(userId, "access_token");
            if (!accessToken) {
                return Promise.reject(new UnauthorizedException(ZoomErrors.ZOOM_401_UNAUTHORIZED));
            }
            const baseUrl = id ? configuration().zoom.urls.zoomApiUrl : configuration().zoom.urls.userProfile;
            const params = id ? `/${85305679063}` : "";
            return await this.http.get<ZoomMeeting | PaginatedZoomResponse<ZoomMeeting>>(
                `${baseUrl}/meetings${params}`,
                {
                    headers: { Authorization: `Bearer ${accessToken}` },
                },
            );
        } catch (e) {
            LoggerService.error(e);
            if (e instanceof UnauthorizedException) {
                await this.refreshToken(userId);
                return await this.getMeeting(userId, id);
            }
            throw e;
        }
    }

    async getZakToken(userId: number): Promise<ZakTokenResponse> {
        try {
            const accessToken = await this.cacheService.getUserData<string>(userId, "access_token");
            if (!accessToken) {
                return Promise.reject(new UnauthorizedException(ZoomErrors.ZOOM_401_UNAUTHORIZED));
            }
            return await this.http.get<ZakTokenResponse>(
                `${configuration().zoom.urls.userProfile}/token?type=zak&ttl=7200`,
                {
                    headers: { Authorization: `Bearer ${accessToken}` },
                },
            );
        } catch (e) {
            if (e instanceof UnauthorizedException) {
                await this.refreshToken(userId);
                return await this.getZakToken(userId);
            }
            throw e;
        }
    }

    generateSignature(meetingNumber: number, role: ZoomMeetingRole): { signature: string } {
        const iat = Math.round(new Date().getTime() / 1000) - 30;
        const exp = iat + 60 * 60 * 2;
        const oHeader = { alg: "HS256", typ: "JWT" };

        const oPayload = {
            sdkKey: configuration().zoom.clientId,
            appKey: configuration().zoom.clientId,
            mn: meetingNumber,
            role,
            iat,
            exp,
            tokenExp: exp,
        };

        const sHeader = JSON.stringify(oHeader);
        const sPayload = JSON.stringify(oPayload);
        const signature = KJUR.jws.JWS.sign("HS256", sHeader, sPayload, configuration().zoom.clientSecret);
        return { signature };
    }

    webhook(req: Request, res: Response): void {
        console.log("=======================Webhook-POST=======================");
        console.log("headers: ", req.headers);
        console.log("----------------------------------------------------------");
        console.log("params: ", req.params);
        console.log("----------------------------------------------------------");
        console.log("query: ", req.query);
        console.log("----------------------------------------------------------");
        console.log("body: ", req.body);
        console.log("----------------------------------------------------------");

        let response;

        // construct the message string
        const message = `v0:${req.headers["x-zm-request-timestamp"]}:${JSON.stringify(req.body)}`;

        const hashForVerify = createHmac("sha256", configuration().zoom.secretToken).update(message).digest("hex");

        // hash the message string with your Webhook Secret Token and prepend the version semantic
        const signature = `v0=${hashForVerify}`;

        // you're validating the request came from Zoom https://marketplace.zoom.us/docs/api-reference/webhook-reference#notification-structure
        if (req.headers["x-zm-signature"] === signature) {
            // Zoom validating you control the webhook endpoint https://marketplace.zoom.us/docs/api-reference/webhook-reference#validate-webhook-endpoint
            if (req.body.event === "endpoint.url_validation") {
                const hashForValidate = createHmac("sha256", configuration().zoom.secretToken)
                    .update(req.body.payload.plainToken)
                    .digest("hex");

                response = {
                    message: {
                        plainToken: req.body.payload.plainToken,
                        encryptedToken: hashForValidate,
                    },
                    status: 200,
                };

                console.log("----------------------------------------------------------");
                console.log(response.message);
                res.status(response.status).json(response.message);
            } else {
                response = { message: "Authorized request to Zoom Webhook sample.", status: 200 };
                console.log("----------------------------------------------------------");
                console.log(response.message);
                res.status(response.status).json(response);
                // business logic here, example make API request to Zoom or 3rd party
            }
        } else {
            response = { message: "Unauthorized request to Zoom Webhook sample.", status: 401 };
            console.log("----------------------------------------------------------");
            console.log(response.message);
            res.status(response.status).json(response);
        }
    }

    webhookGet(req: Request, res: Response): void {
        console.log("=======================Webhook-GET========================");
        console.log("headers: ", req.headers);
        console.log("----------------------------------------------------------");
        console.log("params: ", req.params);
        console.log("----------------------------------------------------------");
        console.log("query: ", req.query);
        console.log("----------------------------------------------------------");
        console.log("body: ", req.body);
        console.log("----------------------------------------------------------");

        res.status(200).redirect(`${configuration().app.webUrl}/${configuration().zoom.urls.routerPath}`);
    }
}
