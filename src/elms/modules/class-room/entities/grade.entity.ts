import { Column, Entity, OneToMany, Unique } from "typeorm";
import { ClassRoom } from "./class-room.entity";
import { BaseEntity } from "../../../../core/entity/base.entity";
import { UNIQUEConstraint } from "../../../../core/enums/constraint.enum";

@Unique(UNIQUEConstraint.GRADE_NAME, ["name"])
@Entity({ name: "grades" })
export class Grade extends BaseEntity {
    @Column({ nullable: false })
    name: string;

    @Column({ nullable: true })
    description?: string;

    @OneToMany(() => ClassRoom, (classRoom) => classRoom.grade)
    classRooms?: ClassRoom[];
}
