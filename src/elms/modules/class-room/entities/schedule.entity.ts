import { Column, Entity, OneToMany, OneToOne } from "typeorm";
import { BaseEntity } from "../../../../core/entity/base.entity";
import { ClassRoom } from "./class-room.entity";
import { Day } from "../../../../core/enums";
import { ZoomMeeting } from "../../zoom/interfaces/zoom.interfaces";
import { ClassScheduleHistory } from "./schedule-history.entity";

@Entity({ name: "schedules" })
export class ClassSchedule extends BaseEntity {
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

    meeting?: ZoomMeeting;
}
