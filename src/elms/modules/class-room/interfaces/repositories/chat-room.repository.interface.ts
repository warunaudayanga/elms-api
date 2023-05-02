import { IEntityRepository } from "../../../../../core/entity/interfaces/entity.repository.interface";
import { ChatRoom } from "../../entities/chat-room.entity";

export interface IChatRoomRepository extends IEntityRepository<ChatRoom> {}
