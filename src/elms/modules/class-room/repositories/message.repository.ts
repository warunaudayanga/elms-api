import { CustomRepository } from "../../../../modules/typeorm-ex/decorators";
import { BaseRepository } from "../../../../core/entity";
import { Message } from "../entities/message.entity";
import { IMessageRepository } from "../interfaces/repositories/message.repository.interface";

@CustomRepository(Message)
export class MessageRepository extends BaseRepository<Message> implements IMessageRepository {}
