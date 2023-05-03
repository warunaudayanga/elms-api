import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Assessment } from "../entities/assessment.entity";
import { ClassRoom } from "../entities/class-room.entity";
import { ClassSchedule } from "../entities/schedule.entity";
import { classRoomRelations, classRoomRelationsAll, ClassStudentsRepository } from "../repositories";
import { IPaginatedResponse, IPagination, ISort } from "../../../../core/entity";
import {
    CreateAssessmentDto,
    FilterClassRoomDto,
    SetScheduleDto,
    UpdateAssessmentDto,
    UpdateClassRoomDto,
} from "../dtos";
import { ClassRoomService } from "./class-room.service";
import { ScheduleService } from "./schedule.service";
import { SocketService } from "../../../../modules/socket/services";
import { Status } from "../../../../core/enums";
import { AppEvent } from "../../../../core/enums/app-event.enum";
import { AssessmentService } from "./assessment.service";
import { ZoomService } from "../../zoom/services/zoom.service";
import { ZoomErrors } from "../responses/zoom.error.responses";

@Injectable()
export class TutorService {
    constructor(
        @InjectRepository(ClassStudentsRepository) private readonly classStudentsRepository: ClassStudentsRepository,
        private readonly classRoomService: ClassRoomService,
        private readonly scheduleService: ScheduleService,
        private readonly assessmentService: AssessmentService,
        private readonly zoomService: ZoomService,
        private readonly socketService: SocketService,
    ) {}

    getMyClasses(
        id: number,
        filters: FilterClassRoomDto,
        sort: ISort<ClassRoom>,
        pagination: IPagination,
        keyword: string,
    ): Promise<IPaginatedResponse<ClassRoom> | ClassRoom[]> {
        return this.classRoomService.getMany({
            pagination,
            sort,
            filters: { ...filters },
            search: keyword ? { name: keyword } : {},
            where: { tutor: { id } },
            relations: classRoomRelations,
        });
    }

    async getClass(userId: number, id: number): Promise<ClassRoom> {
        let classRoom = await this.classRoomService.get(id, { relations: classRoomRelationsAll });
        if (classRoom.schedule) {
            try {
                const meeting = await this.zoomService.getMeeting(userId, classRoom.schedule.meetingId);
                if (meeting) {
                    classRoom.schedule.meeting = meeting;
                }
            } catch (err) {
                if (err.response.code === ZoomErrors.ZOOM_401_UNAUTHORIZED.code) {
                    classRoom.schedule.needZooAuthentication = true;
                }
            }
        }
        return classRoom;
    }

    async requestClassCreate(userId: number, createClassRoomDto: Partial<ClassRoom>): Promise<ClassRoom> {
        let classRoom = await this.classRoomService.createCLassRoom(
            { ...createClassRoomDto, status: Status.PENDING },
            {
                relations: classRoomRelationsAll,
            },
        );
        this.socketService.sendMessage(AppEvent.CLASS_REQUESTED, classRoom, userId);
        return classRoom;
    }

    async requestClassUpdate(userId: number, id: number, updateClassRoomDto: UpdateClassRoomDto): Promise<ClassRoom> {
        return await this.classRoomService.updateClassRoom(userId, id, { changeRequest: updateClassRoomDto });
    }

    async requestClassScheduleSet(
        userId: number,
        classRoomId: number,
        setScheduleDto: SetScheduleDto,
    ): Promise<ClassSchedule> {
        let classSchedule = await this.scheduleService.requestClassScheduleSet(userId, classRoomId, setScheduleDto);
        this.socketService.sendMessage(AppEvent.SCHEDULE_UPDATED, classSchedule, userId);
        return classSchedule;
    }

    async createAssessment(
        userId: number,
        classRoomId: number,
        createAssessmentDto: CreateAssessmentDto,
    ): Promise<Assessment> {
        let assessment = await this.assessmentService.save(
            { ...createAssessmentDto, classRoomId, status: Status.ACTIVE },
            { relations: ["submissions"] },
        );
        this.socketService.sendMessage(AppEvent.ASSESSMENT_CREATED, createAssessmentDto, userId);
        return assessment;
    }

    async updateAssessment(userId: number, id: number, updateAssessmentDto: UpdateAssessmentDto): Promise<Assessment> {
        let assessment = await this.assessmentService.update(id, updateAssessmentDto, { relations: ["submissions"] });
        this.socketService.sendMessage(AppEvent.ASSESSMENT_UPDATED, assessment, userId);
        return assessment;
    }
}
