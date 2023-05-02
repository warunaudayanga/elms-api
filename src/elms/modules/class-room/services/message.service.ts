import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityService } from "src/core/entity";
import { SocketService } from "src/modules/socket/services/socket.service";
import { MessageUserStatus } from "../entities/message-user-status.entity";
import { Message } from "../entities/message.entity";
import { MessageRepository, MessageUserStatusRepository } from "../repositories";
import { OnEvent } from "@nestjs/event-emitter";
import { AppEvent } from "../../../../core/enums/app-event.enum";
import { User } from "../../../../modules/auth/entities";
import { CreateMessageDto, GetMessageDto } from "../dtos";
import { validateDto } from "../../../../core/utils/common.utils";
import { MessageStatus } from "../enums/message-status.enum";

@Injectable()
export class MessageService extends EntityService<Message> {
    constructor(
        @InjectRepository(MessageRepository) private readonly messageRepository: MessageRepository,
        @InjectRepository(MessageUserStatusRepository)
        private readonly messageUserStatusRepository: MessageUserStatusRepository,
        protected readonly socketService: SocketService,
    ) {
        super(socketService, messageRepository, "message");
    }

    @OnEvent(AppEvent.MESSAGE_CREATE)
    async createMessage(sender: User, createMessageDto: CreateMessageDto): Promise<Message> {
        await validateDto(CreateMessageDto, createMessageDto);
        return this.messageRepository.transaction(async (manager) => {
            let message = await this.save(
                { ...createMessageDto, sender },
                { relations: ["sender", "chatRoom", "chatRoom.users"] },
                manager,
            );
            const messageUserStatuses = message.chatRoom.users
                .filter((user) => user.id !== sender.id)
                .map(
                    (user) =>
                        ({
                            messageId: message.id,
                            readerId: user.id,
                            status: MessageStatus.SENT,
                        } as MessageUserStatus),
                );
            await this.messageUserStatusRepository.saveMany(messageUserStatuses, null, manager);
            this.socketService.sendMessage(AppEvent.MESSAGE_CREATED, message, [
                ...message.chatRoom.users.filter((user) => user.id !== sender.id).map((user) => user.id),
            ]);
            return message;
        });
    }

    @OnEvent(AppEvent.MESSAGE_GET)
    async getMessages(sender: User, { chatRoomId }: GetMessageDto): Promise<Message[]> {
        return (await this.getMany({
            sort: { createdAt: "ASC" },
            where: { chatRoom: { classRoom: { id: chatRoomId } } },
            relations: ["sender", "messageUserStatus"],
        })) as Message[];
    }

    @OnEvent(AppEvent.MESSAGE_DELIVERED)
    async setDelivered(sender: User, { chatRoomId }: { chatRoomId: number }): Promise<void> {
        await this.messageUserStatusRepository.transaction(async (manager) => {
            const [userMessageStatus] = await this.messageUserStatusRepository.getMany(
                {
                    where: { message: { chatRoomId }, readerId: sender.id, status: MessageStatus.SENT },
                },
                manager,
            );
            if (userMessageStatus.length) {
                await this.messageUserStatusRepository.updateMany(
                    userMessageStatus.map((messageUserStatus) => messageUserStatus.id),
                    { status: MessageStatus.DELIVERED },
                    manager,
                );
            }
        });
    }

    @OnEvent(AppEvent.MESSAGE_SEEN)
    async setSeen(sender: User, { chatRoomId }: { chatRoomId: number }): Promise<void> {
        await this.messageUserStatusRepository.transaction(async (manager) => {
            const [userMessageStatus] = await this.messageUserStatusRepository.getMany(
                {
                    where: { message: { chatRoomId }, readerId: sender.id },
                },
                manager,
            );
            if (userMessageStatus.length) {
                await this.messageUserStatusRepository.updateMany(
                    userMessageStatus.map((messageUserStatus) => messageUserStatus.id),
                    { status: MessageStatus.SEEN },
                    manager,
                );
            }
        });
    }
}
