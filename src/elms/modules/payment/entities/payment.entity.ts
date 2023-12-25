import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { PaymentStatus } from "../enums/payment-status.enum";
import { PaymentNotifyDto } from "../dtos/payment-notify.dto";

@Entity({ name: "payments" })
export class Payment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "decimal", precision: 10, scale: 2, nullable: false })
    amount: string;

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

    @Column({ type: "json", nullable: false })
    paymentResponse: PaymentNotifyDto;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt?: Date;
}
