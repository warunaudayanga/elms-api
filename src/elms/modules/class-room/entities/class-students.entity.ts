import {
    AfterLoad,
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    Unique,
    UpdateDateColumn,
} from "typeorm";
import { Status } from "../../../../core/enums";
import { ClassRoom } from "./class-room.entity";
import { User } from "../../../../modules/auth/entities";
import { FKConstraint, UNIQUEConstraint } from "../../../../core/enums/constraint.enum";
import { ClassPayment } from "./class-payment.entity";

@Unique(UNIQUEConstraint.CLASS_STUDENT_CLASS_ROOM_STUDENT, ["classRoom", "student"])
@Entity({ name: "class_students" })
export class ClassStudent {
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

    @OneToMany(() => ClassPayment, (classPayment) => classPayment.classStudent)
    classPayments?: ClassPayment[];

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
