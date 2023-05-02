import { Global, Module } from "@nestjs/common";
import { Tutor } from "../../elms/modules/class-room/entities/tutor.entity";
import { AuthController, UserController } from "./controllers";
import { AuthService, UserService } from "./services";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { TypeOrmExModule } from "../typeorm-ex/typeorm-ex.module";
import { UserRepository } from "./repositories";
import { User } from "./entities";
import { LocalStrategy, JwtStrategy } from "./strategies";
import { RedisCacheModule } from "../cache/redis-cache.module";
import configuration from "../../core/config/configuration";
import { FileUploadModule } from "../file-upload/file-upload.module";
import { TutorRepository } from "../../elms/modules/class-room/repositories";

@Global()
@Module({
    imports: [
        JwtModule.register({
            secret: configuration().jwt.secret,
        }),
        PassportModule,
        TypeOrmExModule.forCustomRepository([User, UserRepository, Tutor, TutorRepository]),
        RedisCacheModule,
        FileUploadModule,
    ],
    controllers: [AuthController, UserController],
    providers: [LocalStrategy, JwtStrategy, AuthService, UserService],
    exports: [JwtStrategy, AuthService],
})
export class AuthModule {}
