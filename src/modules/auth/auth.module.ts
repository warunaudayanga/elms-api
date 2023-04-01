import { Global, Module } from "@nestjs/common";
import { AuthController } from "./controllers";
import { AuthService, UserService, RoleService } from "./services";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { TypeOrmExModule } from "../typeorm-ex/typeorm-ex.module";
import { RoleRepository, UserRepository } from "./repositories";
import { User } from "./entities/user.entity";
import { Role } from "./entities/role.entity";
import { UserController } from "./controllers/user.controller";
import { RoleController } from "./controllers/role.controller";
import { LocalStrategy, JwtStrategy } from "./strategies";
import { RedisCacheModule } from "../cache/redis-cache.module";
import configuration from "../../core/config/configuration";
import { FileUploadModule } from "../file-upload/file-upload.module";

@Global()
@Module({
    imports: [
        JwtModule.register({
            secret: configuration().jwt.secret,
        }),
        PassportModule,
        TypeOrmExModule.forCustomRepository([User, Role, UserRepository, RoleRepository]),
        RedisCacheModule,
        FileUploadModule,
    ],
    controllers: [AuthController, UserController, RoleController],
    providers: [LocalStrategy, JwtStrategy, AuthService, UserService, RoleService],
    exports: [JwtStrategy, AuthService],
})
export class AuthModule {}
