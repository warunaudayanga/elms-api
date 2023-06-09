import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityService } from "src/core/entity";
import { SocketService } from "src/modules/socket/services/socket.service";
import { ChatRoom } from "../entities/chat-room.entity";
import { ChatRoomRepository } from "../repositories";

// noinspection JSUnusedGlobalSymbols
export const chatRoomRelations = ["createdBy", "members", "members.user"];

@Injectable()
export class ChatRoomService extends EntityService<ChatRoom> {
    constructor(
        @InjectRepository(ChatRoomRepository) private readonly chatRoomRepository: ChatRoomRepository,
        protected readonly socketService: SocketService,
    ) {
        super(socketService, chatRoomRepository, "chatRoom");
    }
}
