import { CustomRepository } from "../../../../modules/typeorm-ex/decorators";
import { BaseRepository } from "../../../../core/entity";
import { ChatRoom } from "../entities";
import { IChatRoomRepository } from "../interfaces/repositories/chat-room.repository.interface";

@CustomRepository(ChatRoom)
export class ChatRoomRepository extends BaseRepository<ChatRoom> implements IChatRoomRepository {}
