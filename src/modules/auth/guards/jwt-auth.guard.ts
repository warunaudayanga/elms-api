// noinspection JSUnusedGlobalSymbols,JSUnusedLocalSymbols

import { ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AuthErrors } from "../responses";
import { User } from "../entities";
import { ExtractJwt } from "passport-jwt";
import { ACCESS_TOKEN_COOKIE_NAME, AuthService, REFRESH_TOKEN_COOKIE_NAME } from "../services";
import { cookieExtractor } from "../utils/auth.extractors";
import { RedisCacheService } from "../../cache/services/redis-cache.service";
import { LoggerService } from "../../../core/services";
import configuration from "../../../core/config/configuration";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
    constructor(private authService: AuthService, private cacheService: RedisCacheService) {
        super();
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const response = context.switchToHttp().getResponse();

        try {
            const accessToken = ExtractJwt.fromExtractors([cookieExtractor])(request);
            if (accessToken) {
                return this.activate(context);
            }

            const refreshToken = request.signedCookies[REFRESH_TOKEN_COOKIE_NAME];
            if (!refreshToken) {
                return Promise.reject(new UnauthorizedException(AuthErrors.AUTH_401_NOT_LOGGED_IN));
            }

            const user = await this.authService.getUserByToken(refreshToken, true);
            const tokens = this.authService.generateTokens(user);

            request.signedCookies[ACCESS_TOKEN_COOKIE_NAME] = tokens.accessToken;

            response.cookie(ACCESS_TOKEN_COOKIE_NAME, tokens.refreshToken, {
                maxAge: Number(configuration().jwt.secretExp) * 1000,
                httpOnly: true,
                sameSite: configuration().cookies.sameSite,
                secure: configuration().cookies.secure,
                signed: true,
            });
            response.cookie(REFRESH_TOKEN_COOKIE_NAME, tokens.refreshToken, {
                maxAge: Number(configuration().jwt.refreshSecretExp) * 1000,
                httpOnly: true,
                sameSite: configuration().cookies.sameSite,
                secure: configuration().cookies.secure,
                signed: true,
            });

            return this.activate(context);
        } catch (err) {
            LoggerService.error(err);
            response.clearCookie(ACCESS_TOKEN_COOKIE_NAME);
            response.clearCookie(REFRESH_TOKEN_COOKIE_NAME);
            return false;
        }
    }

    activate(context: ExecutionContext): Promise<boolean> {
        return super.canActivate(context) as Promise<boolean>;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    handleRequest(err: any, user: User, info: any): any {
        // You can throw an exception based on either "info" or "err" arguments
        if (err || !user) {
            throw err || new UnauthorizedException(AuthErrors.AUTH_401_INVALID_TOKEN);
        }
        delete user.password;
        delete user.salt;
        return user;
    }
}
