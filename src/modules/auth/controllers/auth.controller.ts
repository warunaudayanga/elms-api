import { Body, Controller, Get, Post, Res, UseGuards, UseInterceptors } from "@nestjs/common";
import { Response } from "express";
import { ACCESS_TOKEN_COOKIE_NAME, AuthService, REFRESH_TOKEN_COOKIE_NAME } from "../services";
import { User } from "src/modules/auth/entities/user.entity";
import { CreateUserDto } from "src/modules/auth/dtos";
import { Endpoint } from "src/core/enums";
import { JwtAuthGuard } from "src/core/guards";
import { ReqUser } from "src/core/decorators";
import { AuthDto, UpdatePasswordDto } from "../dtos";
import { IStatusResponse } from "src/core/entity";
import { LocalAuthGuard } from "../guards";
import { RedisCacheService } from "../../cache/services/redis-cache.service";
import configuration from "../../../core/config/configuration";
import { SuccessResponse } from "../../../core/responses";
import { FileInterceptor } from "@nestjs/platform-express";
import { VerificationDto } from "../dtos/verification.dto";
import { ResendVerificationDto } from "../dtos/resend-verification.dto";
import { RequestResetDto } from "../dtos/request-reset.dto";
import { ResetPasswordDto } from "../dtos/reset-password.dto";

@Controller(Endpoint.AUTH)
export class AuthController {
    constructor(private readonly authService: AuthService, private readonly cacheService: RedisCacheService) {}

    @Post("register")
    @UseInterceptors(FileInterceptor("application"))
    register(@Body() createUserDto: CreateUserDto): Promise<User> {
        return this.authService.registerUser(createUserDto);
    }

    @Post("login")
    @UseGuards(LocalAuthGuard)
    async authenticate(
        @ReqUser() user: User,
        @Body() authDataDto: AuthDto,
        @Res({ passthrough: true }) response: Response,
    ): Promise<User> {
        const tokenResponse = this.authService.generateTokens(user);
        await this.cacheService.setUser(user);
        response.cookie(ACCESS_TOKEN_COOKIE_NAME, tokenResponse.accessToken, {
            maxAge: Number(configuration().jwt.secretExp) * 1000,
            httpOnly: true,
            sameSite: configuration().cookies.sameSite,
            secure: configuration().cookies.secure,
            signed: true,
        });
        response.cookie(REFRESH_TOKEN_COOKIE_NAME, tokenResponse.refreshToken, {
            maxAge: Number(configuration().jwt.refreshSecretExp) * 1000,
            httpOnly: true,
            sameSite: configuration().cookies.sameSite,
            secure: configuration().cookies.secure,
            signed: true,
        });
        return user;
    }

    @Post("verify-account")
    verifyAccount(@Body() verificationDto: VerificationDto): Promise<SuccessResponse> {
        return this.authService.verifyAccount(verificationDto.token);
    }

    @UseGuards(JwtAuthGuard)
    @Get("me")
    getMe(@ReqUser() user: User): Promise<User> {
        return this.authService.getMe(user.id);
    }

    @Post("resend-verification")
    resendVerification(@Body() verificationDto: ResendVerificationDto): Promise<SuccessResponse> {
        return this.authService.resendVerification(verificationDto.email);
    }

    @UseGuards(JwtAuthGuard)
    @Post("change-password")
    changePassword(@ReqUser() user: User, @Body() updatePasswordDto: UpdatePasswordDto): Promise<IStatusResponse> {
        return this.authService.changePassword(user.id, updatePasswordDto);
    }

    @Post("request-password-reset")
    requestPasswordReset(@Body() requestResetDto: RequestResetDto): Promise<SuccessResponse> {
        return this.authService.requestPasswordReset(requestResetDto);
    }

    @Post("reset-password")
    resetPassword(@Body() resetPasswordDto: ResetPasswordDto): Promise<IStatusResponse> {
        return this.authService.resetPassword(resetPasswordDto);
    }

    @Post("logout")
    @UseGuards(JwtAuthGuard)
    async clearAuthentication(
        @ReqUser() user: User,
        @Res({ passthrough: true }) response: Response,
    ): Promise<SuccessResponse> {
        response.cookie(ACCESS_TOKEN_COOKIE_NAME, "", {
            maxAge: 0,
            httpOnly: true,
            sameSite: configuration().cookies.sameSite,
            secure: configuration().cookies.secure,
            signed: true,
            // secure: configuration().app.isProd,
        });
        response.cookie(REFRESH_TOKEN_COOKIE_NAME, "", {
            maxAge: 0,
            httpOnly: true,
            sameSite: configuration().cookies.sameSite,
            secure: configuration().cookies.secure,
            signed: true,
            // secure: configuration().app.isProd,
        });
        await this.cacheService.clearUser(user.id);
        return new SuccessResponse("Successfully logged out");
    }
}
