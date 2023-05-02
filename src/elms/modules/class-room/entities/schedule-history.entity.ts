import {
    AfterLoad,
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import { User } from "../../../../modules/auth/entities";
import { ScheduleStatus } from "../enums";
import { Day } from "../../../../core/enums";
import { FKConstraint } from "../../../../core/enums/constraint.enum";
import { ClassSchedule } from "./schedule.entity";

@Entity({ name: "schedule_histories" })
export class ClassScheduleHistory {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "enum", enum: Day, nullable: false })
    day: Day;

    @Column({ type: "time", nullable: false })
    startTime: string;

    @Column({ type: "time", nullable: false })
    endTime: string;

    @Column({ type: "enum", enum: ScheduleStatus, nullable: false })
    status: ScheduleStatus;

    @Column({ nullable: true })
    scheduleId: number;

    @OneToOne(() => ClassSchedule, (schedule) => schedule.scheduleHistory)
    @JoinColumn({ foreignKeyConstraintName: FKConstraint.SCHEDULE_HISTORY_SCHEDULE })
    schedule?: ClassSchedule;

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
