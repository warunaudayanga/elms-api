import { CustomRepository } from "../../../../modules/typeorm-ex/decorators";
import { BaseRepository } from "../../../../core/entity";
import { MessageUserStatus } from "../entities/message-user-status.entity";
import { IMessageUserStatusRepository } from "../interfaces/repositories/message-user-status.repository.interface";

@CustomRepository(MessageUserStatus)
export class MessageUserStatusRepository
    extends BaseRepository<MessageUserStatus>
    implements IMessageUserStatusRepository {}
