import { Column, Entity, JoinColumn, ManyToOne, OneToMany, Unique } from "typeorm";
import { ClassRoom } from "./class-room.entity";
import { User } from "../../../../modules/auth/entities";
import { BaseEntity } from "../../../../core/entity/base.entity";
import { Payment } from "./payment.entity";
import { FKConstraint, UNIQUEConstraint } from "../../../../core/enums/constraint.enum";

@Unique(UNIQUEConstraint.CLASS_STUDENT_CLASS_ROOM_STUDENT, ["classRoom", "student"])
@Entity({ name: "class_students" })
export class ClassStudent extends BaseEntity {
    @Column({ nullable: true })
    classRoomId?: number;

    @Column({ nullable: true })
    studentId?: number;

    @ManyToOne(() => ClassRoom, (classRoom) => classRoom.classStudents)
    @JoinColumn({ foreignKeyConstraintName: FKConstraint.CLASS_STUDENTS_CLASS_ROOM })
    classRoom?: ClassRoom;

    @ManyToOne(() => User, (user) => user.classStudents)
    @JoinColumn({ foreignKeyConstraintName: FKConstraint.CLASS_STUDENTS_STUDENT })
    student?: User;

    @OneToMany(() => Payment, (payment) => payment.classStudent)
    payments?: Payment[];
}
