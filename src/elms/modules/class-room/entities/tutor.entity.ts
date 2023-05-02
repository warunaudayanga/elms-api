import { BaseEntity } from "../../../../core/entity/base.entity";
import { Entity, ManyToMany, OneToMany, OneToOne } from "typeorm";
import { User } from "../../../../modules/auth/entities";
import { ClassSubject } from "./subject.entity";
import { ClassRoom } from "./class-room.entity";

@Entity({ name: "tutors" })
export class Tutor extends BaseEntity {
    @OneToOne(() => User, (user) => user.tutor)
    user?: User;

    @ManyToMany(() => ClassSubject, (subject) => subject.tutors)
    subjects?: ClassSubject[];

    @OneToMany(() => ClassRoom, (classRoom) => classRoom.tutor)
    classRooms?: ClassRoom[];
}
