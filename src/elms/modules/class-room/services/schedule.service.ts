import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityService } from "src/core/entity";
import { SocketService } from "src/modules/socket/services/socket.service";
import { ClassSchedule } from "../entities";
import { ClassScheduleRepository } from "../repositories";
import { ZoomService } from "../../zoom/services/zoom.service";
import { SetScheduleDto } from "../dtos";
import { ClassRoomService } from "./class-room.service";
import { Status } from "../../../../core/enums";
import { AppEvent } from "../../../../core/enums/app-event.enum";

@Injectable()
export class ScheduleService extends EntityService<ClassSchedule> {
    constructor(
        @InjectRepository(ClassScheduleRepository) private readonly scheduleRepository: ClassScheduleRepository,
        protected readonly classRoomService: ClassRoomService,
        protected readonly socketService: SocketService,
        protected readonly zoomService: ZoomService,
    ) {
        super(socketService, scheduleRepository, "schedule");
    }

    async saveClassSchedule(
        userId: number,
        classRoomId: number,
        createScheduleDto: Partial<ClassSchedule>,
    ): Promise<ClassSchedule> {
        let classSchedule = await super.save(
            { ...createScheduleDto, createdBy: { id: userId } },
            { relations: ["classRoom"] },
        );
        const classRoom = await this.classRoomService.update(classRoomId, { schedule: classSchedule });
        classSchedule.classRoom = classRoom;
        const meeting = await this.zoomService.createMeeting(classRoom.name);
        if (meeting) {
            classSchedule.meetingId = meeting.id;
            classSchedule.joinUrl = meeting.join_url;
            await this.update(classSchedule.id, { meetingId: meeting.id, joinUrl: meeting.join_url });
        }
        return classSchedule;
    }

    async updateClassSchedule(userId: number, id: number, updateDto: Partial<ClassSchedule>): Promise<ClassSchedule> {
        let classSchedule = await super.update(id, updateDto, { relations: ["classRoom"] });
        this.socketService.sendMessage(AppEvent.SCHEDULE_UPDATED, classSchedule, userId);
        return classSchedule;
    }

    async requestClassScheduleSet(
        userId: number,
        classRoomId: number,
        setScheduleDto: SetScheduleDto,
    ): Promise<ClassSchedule> {
        const schedule = await this.scheduleRepository.getOne({ where: { classRoom: { id: classRoomId } } });
        if (schedule) {
            return await this.update(schedule.id, { changeRequest: setScheduleDto }, { relations: ["classRoom"] });
        }
        let classSchedule = await this.saveClassSchedule(userId, classRoomId, {
            ...setScheduleDto,
            status: Status.PENDING,
        });
        await this.classRoomService.update(classRoomId, { schedule: classSchedule });
        return classSchedule;
    }
}
