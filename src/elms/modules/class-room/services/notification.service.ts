import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityService } from "src/core/entity";
import { SocketService } from "src/modules/socket/services/socket.service";
import { NotificationRepository } from "../repositories/notification.repository";
import { Notification } from "../entities/notification.entity";
import { AppEvent } from "../../../../core/enums/app-event.enum";
import { CreateNotificationDto } from "../dtos/create-notification.dto";
import { OnEvent } from "@nestjs/event-emitter";
import { User } from "../../../../modules/auth/entities";
import { NotificationStatus } from "../enums/notification-status.enum";

@Injectable()
export class NotificationService extends EntityService<Notification> {
    constructor(
        @InjectRepository(NotificationRepository) private readonly notificationRepository: NotificationRepository,
        protected readonly socketService: SocketService,
    ) {
        super(socketService, notificationRepository, "notification");
    }

    // noinspection JSUnusedGlobalSymbols
    async createNotification(content: string, recipientId: number): Promise<boolean>;

    async createNotification(content: string, recipientIds: number[]): Promise<boolean>;

    async createNotification(content: string, recipientIdOrIds: number | number[]): Promise<boolean> {
        const notificationDtos: CreateNotificationDto[] = Array.isArray(recipientIdOrIds)
            ? recipientIdOrIds.map((id) => ({ userId: id, content }))
            : [{ userId: recipientIdOrIds, content }];
        const notifications = await this.saveMany(notificationDtos);
        if (notifications.length) {
            notifications.forEach((notification) => {
                this.socketService.sendMessage(AppEvent.NOTIFICATION_CREATED, notification, [notification.userId]);
            });
            return true;
        }
        return false;
    }

    @OnEvent(AppEvent.NOTIFICATION_READ)
    async setSeen(sender: User): Promise<void> {
        await this.updateMany({ userId: sender.id }, { status: NotificationStatus.READ });
    }

    @OnEvent(AppEvent.NOTIFICATION_DELETE)
    deleteNotification(sender: User, { id }: { id: number }): Promise<Notification> {
        return this.delete(id, sender, true);
    }
}
