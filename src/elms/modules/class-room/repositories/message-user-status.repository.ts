import { CustomRepository } from "../../../../modules/typeorm-ex/decorators";
import { BaseRepository } from "../../../../core/entity";
import { IMessageUserStatusRepository } from "../interfaces/repositories/message-user-status.repository.interface";
import { MessageUserStatus } from "../entities";

@CustomRepository(MessageUserStatus)
export class MessageUserStatusRepository
    extends BaseRepository<MessageUserStatus>
    implements IMessageUserStatusRepository {}
