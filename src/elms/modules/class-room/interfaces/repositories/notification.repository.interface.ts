import { IEntityRepository } from "../../../../../core/entity/interfaces/entity.repository.interface";
import { Notification } from "../../entities/notification.entity";

export interface INotificationRepository extends IEntityRepository<Notification> {}
