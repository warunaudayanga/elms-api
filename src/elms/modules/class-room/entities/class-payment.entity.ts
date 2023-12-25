import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import { ClassRoom } from "./class-room.entity";
import { Payment } from "../../payment/entities/payment.entity";
import { FKConstraint } from "../../../../core/enums/constraint.enum";
import { Status } from "../../../../core/enums";
import { ClassStudent } from "./class-students.entity";

@Entity({ name: "class_payment" })
export class ClassPayment {
    @Column({ nullable: true })
    classStudentId?: number;

    @Column({ nullable: true })
    classRoomId?: number;

    @ManyToOne(() => ClassStudent)
    @JoinColumn({ foreignKeyConstraintName: FKConstraint.CLASS_PAYMENT_CLASS_STUDENT })
    classStudent?: ClassStudent;

    @ManyToOne(() => ClassRoom)
    @JoinColumn({ foreignKeyConstraintName: FKConstraint.CLASS_PAYMENT_CLASS_ROOM })
    classRoom?: ClassRoom;

    @ManyToOne(() => Payment)
    @JoinColumn({ foreignKeyConstraintName: FKConstraint.CLASS_PAYMENT_PAYMENT })
    payment?: Payment;

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "enum", enum: Status, default: Status.PENDING })
    status: Status | string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt?: Date;
}
