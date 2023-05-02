import { Column, Entity, ManyToMany, OneToMany, Unique } from "typeorm";
import { BaseEntity } from "../../../../core/entity/base.entity";
import { Tutor } from "./tutor.entity";
import { ClassRoom } from "./class-room.entity";
import { UNIQUEConstraint } from "../../../../core/enums/constraint.enum";

@Unique(UNIQUEConstraint.SUBJECT_NAME, ["name"])
@Entity({ name: "subjects" })
export class ClassSubject extends BaseEntity {
    @Column({ nullable: false })
    name: string;

    @Column({ nullable: true })
    description?: string;

    @ManyToMany(() => Tutor, (tutor) => tutor.subjects)
    tutors?: Tutor[];

    @OneToMany(() => ClassRoom, (classRoom) => classRoom.subject)
    classRooms?: ClassRoom[];
}
