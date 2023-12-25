import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import configuration from "./core/config/configuration";
import { ConfigModule } from "@nestjs/config";
import { ScheduleModule } from "@nestjs/schedule";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { MysqlConnectionOptions } from "typeorm/driver/mysql/MysqlConnectionOptions";
import { AuthModule, CommonModule, SeedingModule, SocketModule, WebhookModule } from "./modules";
import { ClassRoomModule } from "./elms/modules/class-room/class-room.module";
import { ZoomModule } from "./elms/modules/zoom/zoom.module";
import { RouteInfo } from "@nestjs/common/interfaces";
import { RawBodyMiddleware } from "./core/middlewares/row-body-parser.middleware";
import { JsonBodyMiddleware } from "./core/middlewares/json-body-parser.middleware";
import { MailerModule } from "@nestjs-modules/mailer";
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";
import { join } from "path";
import { PaymentModule } from "./elms/modules/payment/payment.module";

const getSmtpTransport = (): string => {
    return `smtps://${configuration().email.user}:${configuration().email.pass}@${configuration().email.host}`;
};

const rawBodyRoutes: Array<RouteInfo> = [
    {
        path: "*stripe/webhook",
        method: RequestMethod.POST,
    },
];

@Module({
    imports: [
        ConfigModule.forRoot({ load: [configuration], isGlobal: true }),
        CommonModule,
        ScheduleModule.forRoot(),
        EventEmitterModule.forRoot(),
        MailerModule.forRoot({
            transport: getSmtpTransport(),
            defaults: {
                from: `"eLMS" <${configuration().email.user}>`,
            },
            template: {
                dir: join(__dirname + "/modules/common/templates"),
                adapter: new HandlebarsAdapter(),
                options: {
                    strict: true,
                },
            },
        }),
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
        ZoomModule,
        ClassRoomModule,
        PaymentModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer): MiddlewareConsumer | void {
        consumer
            .apply(RawBodyMiddleware)
            .forRoutes(...rawBodyRoutes)
            .apply(JsonBodyMiddleware)
            .exclude(...rawBodyRoutes)
            .forRoutes("*");
    }
}
