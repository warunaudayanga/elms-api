import { Injectable } from "@nestjs/common";
import { OneSignalService } from "onesignal-api-client-nest";

@Injectable()
export class PushNotificationService {
    // noinspection JSUnusedLocalSymbols
    constructor(private readonly oneSignalService: OneSignalService) {}
}
