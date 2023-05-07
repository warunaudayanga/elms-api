import {
    BadRequestException,
    ConflictException,
    ForbiddenException,
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from "@nestjs/common";
import { pbkdf2Sync, randomBytes } from "crypto";
import { JwtService } from "@nestjs/jwt";
import { ITokenData, ITokenResponse } from "../interfaces";
import { AuthErrors } from "../responses";
import { User } from "src/modules/auth/entities/user.entity";
import { LoggerService } from "src/core/services";
import { EntityErrors, EntityUtils, IQueryError, IStatusResponse, Operation } from "src/core/entity";
import { Status } from "src/core/enums";
import { EventEmitter2, OnEvent } from "@nestjs/event-emitter";
import { WebhookEvent } from "src/modules/webhook/enums/webhook-event.enum";
import { UpdatePasswordDto } from "../dtos";
import { UserService } from "./user.service";
import { Role } from "../enums";
import configuration from "../../../core/config/configuration";
import { RedisCacheService } from "../../cache/services/redis-cache.service";
import { FileUploadService } from "../../file-upload/file-upload.service";
import { CreateTutorDto } from "../dtos/create-tutor.dto";
import { TutorRepository } from "../../../elms/modules/class-room/repositories";
import { userRelations } from "../repositories";
import { AppEvent } from "../../../core/enums/app-event.enum";
import { EntityManager } from "typeorm";
import { VerificationService } from "./verification.service";
import { EmailService } from "../../common/services";
import { SuccessResponse } from "../../../core/responses";
import { VerificationType } from "../enums/verification-type.enum";

export const ACCESS_TOKEN_COOKIE_NAME = "Authorization";
export const REFRESH_TOKEN_COOKIE_NAME = "Refresh";

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly verificationService: VerificationService,
        private readonly cacheService: RedisCacheService,
        private readonly jwtService: JwtService,
        private readonly fileUploadService: FileUploadService,
        private readonly eventEmitter: EventEmitter2,
        private readonly tutorRepository: TutorRepository,
        private readonly emailService: EmailService,
    ) {
        // this.sendVerificationEmail({ id: 1, name: "Waruna Udayanga", email: "avawaruna@gmail.com" } as User);
    }

    // noinspection JSUnusedGlobalSymbols
    public static generateRandomHash(): string {
        return randomBytes(48).toString("hex");
    }

    public static generatePassword(password: string): { salt: string; password: string } {
        const salt = randomBytes(32).toString("hex");
        const hash = pbkdf2Sync(password, salt, 10000, 64, "sha512").toString("hex");
        return { salt, password: hash };
    }

    public static verifyHash(password: string, hash: string, salt: string): boolean {
        const generatedHash = pbkdf2Sync(password, salt, 10000, 64, "sha512").toString("hex");
        return hash === generatedHash;
    }

    public generateToken(payload: ITokenData, secret: string, expiresIn: string): string {
        return this.jwtService.sign(payload, { secret, expiresIn: `${expiresIn}s` });
    }

    async registerUser(createUserDto: Partial<User>, createdBy?: User, manager?: EntityManager): Promise<User> {
        const { password: rawPass, areaId, ...rest } = createUserDto;
        const { password, salt } = AuthService.generatePassword(rawPass);
        // createProfileDto.application = await this.fileUploadService.upload(application, FileType.APPLICATION);
        const eh = (e: IQueryError): Error | void => {
            if (e.sqlMessage?.match("users.UNIQUE_user_email")) {
                return new ConflictException(EntityErrors.E_409_EXIST_U("user", "email"));
            }
        };
        let user = await this.userService.save(
            {
                ...rest,
                password,
                salt,
                role: rest.role || Role.STUDENT,
                status: rest.status || Status.PENDING,
                createdBy,
                area: { id: areaId },
            },
            { relations: userRelations },
            manager,
            eh,
        );
        this.eventEmitter.emit(WebhookEvent.USER_REGISTERED, user);
        await this.sendVerificationEmail(user);
        return user;
    }

    async createTutor(createTutorDto: CreateTutorDto, createdBy: User): Promise<User> {
        const tutor = await this.tutorRepository.save({ createdBy });
        return await this.registerUser(
            { ...createTutorDto, status: Status.ACTIVE, role: Role.TUTOR, tutor },
            createdBy,
        );
    }

    async authenticate(username: string, password: string): Promise<User> {
        try {
            const user = await this.userService.getOne({ where: { username }, relations: userRelations });
            if (!user) {
                return Promise.reject(new UnauthorizedException(AuthErrors.AUTH_401_INVALID));
            }
            if (!AuthService.verifyHash(password, user.password, user.salt)) {
                return Promise.reject(new UnauthorizedException(AuthErrors.AUTH_401_INVALID));
            }
            if (user.status === Status.PENDING) {
                return Promise.reject(new ForbiddenException(AuthErrors.AUTH_403_PENDING));
            }
            if (user.status !== Status.ACTIVE) {
                return Promise.reject(new UnauthorizedException(AuthErrors.AUTH_401_NOT_ACTIVE));
            }
            return user;
        } catch (err: any) {
            LoggerService.error(err);
            throw new UnauthorizedException(AuthErrors.AUTH_401_INVALID);
        }
    }

    async changePassword(id: number, updatePasswordDto: UpdatePasswordDto): Promise<IStatusResponse> {
        const { password, salt } = await this.userService.get(id);
        const { oldPassword, newPassword } = updatePasswordDto;
        if (AuthService.verifyHash(oldPassword, password, salt)) {
            const { password, salt } = AuthService.generatePassword(newPassword);
            await this.userService.update(id, { password, salt });
            return EntityUtils.handleSuccess(Operation.UPDATE, "user");
        }
        throw new NotFoundException(AuthErrors.AUTH_401_INVALID_PASSWORD);
    }

    generateTokens(user: User): ITokenResponse {
        const payload: ITokenData = {
            sub: user.id,
            email: user.email,
        };
        const accessToken: string = this.generateToken(
            payload,
            configuration().jwt.secret,
            configuration().jwt.secretExp,
        );

        const refreshToken: string = this.generateToken(
            payload,
            configuration().jwt.refreshSecret,
            configuration().jwt.refreshSecretExp,
        );
        return {
            accessToken,
            refreshToken,
            accessTokenExpiresIn: `${configuration().jwt.secretExp}s`,
            refreshTokenExpiresIn: `${configuration().jwt.refreshSecretExp}s`,
        };
    }

    public verifyToken(token: string, refresh?: boolean): { sub: number; email: number } {
        return this.jwtService.verify(token, {
            secret: refresh ? configuration().jwt.refreshSecret : configuration().jwt.secret,
        });
    }

    @OnEvent(AppEvent.USER_GET_BY_TOKEN)
    public async getUserByToken(bearerToken: string, refresh?: boolean): Promise<User> {
        try {
            const payload = this.verifyToken(bearerToken, refresh);
            const user = await this.userService.get(payload.sub, { relations: userRelations });
            if (!user) {
                return null;
            }
            return user;
        } catch (err: any) {
            LoggerService.error(err);
            return null;
        }
    }

    async sendVerificationEmail(user: User): Promise<void> {
        const token = AuthService.generateRandomHash();
        await this.verificationService.save({ user, token });
        await this.emailService.sendVerificationEmail(user.email, user.name, token);
    }

    async verifyAccount(token: string): Promise<SuccessResponse> {
        const verification = await this.verificationService.getOne({ where: { token }, relations: ["user"] });
        if (verification) {
            await this.userService.update(verification.user.id, { status: Status.ACTIVE });
            await this.verificationService.deleteToken(verification.id);
            return new SuccessResponse("Account verified successfully");
        }
        throw new NotFoundException(AuthErrors.AUTH_401_INVALID_VERIFICATION_TOKEN);
    }

    async resendVerification(email: string): Promise<SuccessResponse> {
        try {
            const user = await this.userService.getOne({ where: { email } });
            if (user) {
                if (user.status === Status.ACTIVE) {
                    return Promise.reject(new BadRequestException(AuthErrors.AUTH_400_ALREADY_VERIFIED));
                }
                try {
                    const verification = await this.verificationService.getOne({
                        where: { user: { id: user.id }, type: VerificationType.EMAIL },
                    });
                    await this.verificationService.deleteToken(verification.id);
                } catch (err) {
                    if (!(err instanceof NotFoundException)) {
                        return Promise.reject(err);
                    }
                }
                await this.sendVerificationEmail(user);
                return new SuccessResponse("Verification email sent successfully");
            }
            return Promise.reject(new NotFoundException(AuthErrors.AUTH_404_EMAIL));
        } catch (err) {
            if (err instanceof NotFoundException) {
                throw new NotFoundException(AuthErrors.AUTH_404_EMAIL);
            }
            throw err;
        }
    }

    getMe(id: number): Promise<User> {
        return this.userService.get(id, { relations: userRelations });
    }
}
