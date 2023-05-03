import {
    AfterLoad,
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    ManyToOne,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import { BaseEntity } from "../../../../core/entity/base.entity";
import { User } from "../../../../modules/auth/entities";
import { ClassRoom } from "./class-room.entity";
import { Day, Status } from "../../../../core/enums";
import { ZoomMeeting } from "../../zoom/interfaces/zoom.interfaces";
import { ClassScheduleHistory } from "./schedule-history.entity";

@Entity({ name: "schedules" })
export class ClassSchedule {
    @Column({ type: "enum", enum: Day, nullable: false })
    day: Day;

    @Column({ type: "time", nullable: false })
    startTime: string;

    @Column({ type: "time", nullable: false })
    endTime: string;

    @Column({ type: "bigint", nullable: true })
    meetingId?: number;

    @Column({ nullable: true })
    joinUrl?: string;

    @Column({ type: "json", nullable: true })
    // eslint-disable-next-line no-use-before-define
    changeRequest?: Omit<Partial<ClassSchedule>, "changeRequest" | keyof BaseEntity>;

    @OneToOne(() => ClassRoom, (classRoom) => classRoom.schedule)
    classRoom?: ClassRoom;

    @OneToMany(() => ClassScheduleHistory, (scheduleHistory) => scheduleHistory.schedule)
    scheduleHistory?: ClassScheduleHistory[];

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

    needZooAuthentication?: boolean;

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

    meeting?: ZoomMeeting;
}
