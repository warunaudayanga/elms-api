import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import configuration from "./core/config/configuration";
import { ConfigModule } from "@nestjs/config";
import { ScheduleModule } from "@nestjs/schedule";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { MysqlConnectionOptions } from "typeorm/driver/mysql/MysqlConnectionOptions";
import { AuthModule, CommonModule, SeedingModule, SocketModule, WebhookModule } from "./modules";
import { ProfileModule } from "./elms/modules/profile/profile.module";

@Module({
    imports: [
        ConfigModule.forRoot({ load: [configuration], isGlobal: true }),
        CommonModule,
        ScheduleModule.forRoot(),
        EventEmitterModule.forRoot(),
        TypeOrmModule.forRoot({
            type: configuration().database.type as MysqlConnectionOptions["type"],
            host: configuration().database.host,
            port: Number(configuration().database.port) || 3306,
            username: configuration().database.user,
            password: configuration().database.password,
            database: configuration().database.schema,
            entities: ["dist/**/*.entity{.ts,.js}"],
            charset: configuration().database.charset,
            extra: {
                charset: configuration().database.charset,
            },
            synchronize: configuration().database.synchronize,
            legacySpatialSupport: false,
            keepConnectionAlive: true,
            autoLoadEntities: true,
        }),
        SocketModule,
        WebhookModule,
        SeedingModule,
        AuthModule,
        ProfileModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}