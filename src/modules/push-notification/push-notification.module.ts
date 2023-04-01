import { Module } from "@nestjs/common";
import { OneSignalModule } from "onesignal-api-client-nest";
import configuration from "../../core/config/configuration";

@Module({
    imports: [
        OneSignalModule.forRoot({
            appId: configuration().onesignal.appId,
            restApiKey: configuration().onesignal.restApiKey,
        }),
    ],
    // providers: [SocketService, SocketGateway],
    // exports: [LoggerService],
})
export class PushNotificationModule {}
