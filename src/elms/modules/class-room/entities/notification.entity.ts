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
import { User } from "../../../../modules/auth/entities";
import { NotificationStatus } from "../enums/notification-status.enum";
import { FKConstraint } from "../../../../core/enums/constraint.enum";

@Entity({ name: "notifications" })
export class Notification {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    content: string;

    @Column({ nullable: true })
    userId: number;

    @Column({ type: "json", nullable: true })
    metadata: object;

    @ManyToOne(() => User, (user) => user.notifications)
    @JoinColumn({ foreignKeyConstraintName: FKConstraint.NOTIFICATION_USER })
    user?: User;

    @Column({ type: "enum", enum: NotificationStatus, default: NotificationStatus.UNREAD })
    status: NotificationStatus | string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt?: Date;
}
