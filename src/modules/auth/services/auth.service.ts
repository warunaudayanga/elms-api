import {
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
import { CreateUserDto } from "src/modules/auth/dtos";
import { LoggerService } from "src/core/services";
import { EntityErrors, IQueryError, IStatusResponse } from "src/core/entity";
import { Status } from "src/core/enums";
import { EventEmitter2, OnEvent } from "@nestjs/event-emitter";
import { Events } from "src/modules/webhook/enums/events.enum";
import { UpdatePasswordDto } from "../dtos";
import { UserService } from "./user.service";
import { RoleService } from "./role.service";
import { DefaultRoles } from "../enums";
import configuration from "../../../core/config/configuration";
import { RedisCacheService } from "../../cache/services/redis-cache.service";
import { MulterFile } from "../../../core/interfaces/multer-file";
import { FileUploadService } from "../../file-upload/file-upload.service";

export const ACCESS_TOKEN_COOKIE_NAME = "Authorization";
export const REFRESH_TOKEN_COOKIE_NAME = "Refresh";

export const userRelations = ["role", "profile"];

@Injectable()
export class AuthService {
    // private static keyPath = join(__dirname, "../config/keys");

    // private static PRV_KEY = readFileSync(join(AuthService.keyPath, "id_rsa_prv.pem"), "utf8");

    // private static PUB_KEY = readFileSync(join(AuthService.keyPath, "id_rsa_pub.pem"), "utf8");

    constructor(
        private readonly userService: UserService,
        private readonly cacheService: RedisCacheService,
        private readonly roleService: RoleService,
        private readonly jwtService: JwtService,
        private readonly fileUploadService: FileUploadService,
        private readonly eventEmitter: EventEmitter2,
    ) {}

    // public static getPrivateKey(): string {
    //     return AuthService.PRV_KEY;
    // }

    // public static getPublicKey(): string {
    //     return AuthService.PUB_KEY;
    // }

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

    async registerUser(createUserDto: CreateUserDto, application?: MulterFile, createdBy?: User): Promise<User> {
        const { username, password: rawPass, ...createProfileDto } = createUserDto;
        const { password, salt } = AuthService.generatePassword(rawPass);
        const role = await this.roleService.getOne({ where: { name: DefaultRoles.USER } });
        // createProfileDto.application = await this.fileUploadService.upload(application, FileType.APPLICATION);
        const eh = (e: IQueryError): Error | void => {
            if (e.sqlMessage?.match("users.USERNAME")) {
                return new ConflictException(EntityErrors.E_409_EXIST_U("user", "username"));
            }
        };
        // const [profile] = (await this.eventEmitter.emitAsync(UserEvent.USER_BEFORE_REGISTER, createProfileDto)) as [
        //     BaseProfile,
        // ];
        // if (profile) {
        //
        // }
        let user = await this.userService.create(
            { username, password, salt, role, status: Status.PENDING, profile: createProfileDto, createdBy },
            null,
            null,
            eh,
        );
        this.eventEmitter.emit(Events.USER_REGISTERED, user);
        return user;
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
            return this.userService.update(id, { password, salt });
        }
        throw new NotFoundException(AuthErrors.AUTH_401_INVALID_PASSWORD);
    }

    generateTokens(user: User): ITokenResponse {
        const payload: ITokenData = {
            sub: user.id,
            email: user.profile.email,
            profileId: user.profile.id,
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

    public verifyToken(token: string, refresh?: boolean): { sub: number; email: number; profileId: number } {
        return this.jwtService.verify(token, {
            secret: refresh ? configuration().jwt.refreshSecret : configuration().jwt.secret,
        });
    }

    @OnEvent(Events.USER_GET_BY_TOKEN)
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
}
