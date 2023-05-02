import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ChatRoom } from "./chat-room.entity";
import { User } from "../../../../modules/auth/entities";
import { MessageType } from "../enums/message-type.enum";
import { MessageUserStatus } from "./message-user-status.entity";

@Entity({ name: "messages" })
export class Message {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "longtext", nullable: false })
    message: string;

    @Column({ type: "enum", enum: MessageType, default: MessageType.NORMAL })
    type: MessageType;

    @Column({ nullable: true })
    senderId?: number;

    @Column({ nullable: true })
    chatRoomId?: number;

    @ManyToOne(() => User)
    sender?: User;

    @ManyToOne(() => ChatRoom, (chatRoom) => chatRoom.messages)
    chatRoom?: ChatRoom;

    @OneToMany(() => MessageUserStatus, (messageUserStatus) => messageUserStatus.message, { eager: true })
    messageUserStatus?: MessageUserStatus[];

    @CreateDateColumn()
    createdAt: Date;
}
