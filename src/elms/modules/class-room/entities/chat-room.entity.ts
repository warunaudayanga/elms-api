import { Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToMany, OneToOne } from "typeorm";
import { BaseEntity } from "../../../../core/entity/base.entity";
import { ClassRoom } from "./index";
import { User } from "../../../../modules/auth/entities";
import { Message } from "./message.entity";

@Entity({ name: "chat_rooms" })
export class ChatRoom extends BaseEntity {
    @Column({ nullable: true })
    name?: string;

    @Column({ nullable: true })
    classRoomId?: number;

    @OneToOne(() => ClassRoom, (classRoom) => classRoom.chatRoom)
    @JoinColumn()
    classRoom?: ClassRoom;

    @ManyToMany(() => User, { cascade: true })
    @JoinTable({ name: "chat_room_users" })
    users?: User[];

    @OneToMany(() => Message, (message) => message.chatRoom)
    messages?: Message[];
}
