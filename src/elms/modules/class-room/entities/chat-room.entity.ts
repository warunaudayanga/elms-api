import {
    AfterLoad,
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import { Status } from "../../../../core/enums";
import { User } from "../../../../modules/auth/entities";
import { ClassRoom } from "./class-room.entity";
import { Message } from "./message.entity";

@Entity({ name: "chat_rooms" })
export class ChatRoom {
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

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "enum", enum: Status, default: Status.PENDING })
    status: Status | string;

    @CreateDateColumn()
    createdAt: Date;

    @ManyToOne(() => User)
    createdBy?: User;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => User)
    updatedBy?: User;

    @DeleteDateColumn()
    deletedAt?: Date;

    @ManyToOne(() => User)
    deletedBy?: User;

    @AfterLoad()
    afterLoad(): void {
        this.createdBy = this.createdBy
            ? ({
                  id: this.createdBy.id,
                  firstName: this.createdBy.firstName,
                  lastName: this.createdBy.lastName,
              } as User)
            : null;
        this.updatedBy = this.updatedBy
            ? ({
                  id: this.updatedBy.id,
                  firstName: this.updatedBy.firstName,
                  lastName: this.updatedBy.lastName,
              } as User)
            : null;
        this.deletedBy = this.deletedBy
            ? ({
                  id: this.deletedBy.id,
                  firstName: this.deletedBy.firstName,
                  lastName: this.deletedBy.lastName,
              } as User)
            : null;
    }
}
