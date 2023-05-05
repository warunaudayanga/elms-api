import { CustomRepository } from "../../../../modules/typeorm-ex/decorators";
import { BaseRepository } from "src/core/entity";
import { Notification } from "../entities/notification.entity";
import { INotificationRepository } from "../interfaces/repositories/notification.repository.interface";

@CustomRepository(Notification)
export class NotificationRepository extends BaseRepository<Notification> implements INotificationRepository {}
