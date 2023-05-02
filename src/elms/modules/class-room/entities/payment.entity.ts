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
import { PaymentStatus } from "../enums";
import { ClassStudent } from "./class-students.entity";
import { FKConstraint } from "../../../../core/enums/constraint.enum";

@Entity({ name: "payments" })
export class Payment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "decimal", precision: 10, scale: 2, nullable: false })
    amount: number;

    @Column({ length: 3, nullable: false })
    currency: string;

    @Column({ nullable: false })
    transactionId: string;

    @Column({ type: "date", nullable: false })
    fromDate: string;

    @Column({ type: "date", nullable: false })
    toDate: string;

    @Column({ type: "enum", enum: PaymentStatus, nullable: false })
    status: PaymentStatus;

    @ManyToOne(() => ClassStudent, (classStudent) => classStudent.payments)
    @JoinColumn({ foreignKeyConstraintName: FKConstraint.PAYMENT_CLASS_STUDENTS })
    classStudent?: ClassStudent;

    @Column({ type: "json", nullable: false })
    stripeData: object;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt?: Date;
}
