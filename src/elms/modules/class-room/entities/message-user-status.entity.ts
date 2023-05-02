import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { User } from "../../../../modules/auth/entities";
import { MessageStatus } from "../enums/message-status.enum";
import { Message } from "./message.entity";
import { UNIQUEConstraint } from "../../../../core/enums/constraint.enum";

@Unique(UNIQUEConstraint.MESSAGES_USER_STATUS_MESSAGE_READER, ["message", "reader"])
@Entity({ name: "messages_user_status" })
export class MessageUserStatus {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "enum", enum: MessageStatus, default: MessageStatus.SENT })
    status: MessageStatus;

    @Column({ nullable: true })
    messageId?: number;

    @Column({ nullable: true })
    readerId?: number;

    @ManyToOne(() => Message, (message) => message.messageUserStatus)
    message?: Message;

    @ManyToOne(() => User, (reader) => reader.messageUserStatus)
    reader?: User;

    @CreateDateColumn()
    createdAt: Date;
}
