import { ConflictException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { IPaginatedResponse, IPagination, ISort } from "../../../../core/entity";
import { Status } from "../../../../core/enums";
import { AppEvent } from "../../../../core/enums/app-event.enum";
import { UNIQUEConstraint } from "../../../../core/enums/constraint.enum";
import { isThisMonth } from "../../../../core/utils";
import { User } from "../../../../modules/auth/entities";
import { SocketService } from "../../../../modules/socket/services";
import { FilterClassRoomDto } from "../dtos";
import { SubmitAssessmentDto } from "../dtos/submit-assessment.dto";
import { AssessmentSubmission } from "../entities/assessment-submissions.entity";
import { Assessment } from "../entities/assessment.entity";
import { ClassRoom } from "../entities/class-room.entity";
import { ClassStudent } from "../entities/class-students.entity";
import { Message } from "../entities/message.entity";
import { PaymentStatus } from "../enums";
import { classRoomRelations, classRoomRelationsAll, ClassStudentsRepository } from "../repositories";
import { ClassRoomErrors } from "../responses";
import { AssessmentSubmissionService } from "./assessment-submission.service";
import { AssessmentService } from "./assessment.service";
import { ChatRoomService } from "./chat-room.service";
import { ClassRoomService } from "./class-room.service";
import { MessageService } from "./message.service";

@Injectable()
export class StudentService {
    constructor(
        @InjectRepository(ClassStudentsRepository) private readonly classStudentsRepository: ClassStudentsRepository,
        private readonly classRoomService: ClassRoomService,
        private readonly chatRoomService: ChatRoomService,
        private readonly messageService: MessageService,
        private readonly assessmentService: AssessmentService,
        private readonly assessmentSubmissionService: AssessmentSubmissionService,
        private readonly socketService: SocketService,
    ) {}

    async enrollToClass(studentId: number, classRoomId: number): Promise<ClassStudent> {
        try {
            let classStudent = await this.classStudentsRepository.saveAndGet({ classRoomId, studentId });
            const chatRoom = await this.chatRoomService.getOne({ where: { classRoomId }, relations: ["users"] });
            chatRoom.users.push({ id: studentId } as User);
            await this.chatRoomService.save(chatRoom);
            return classStudent;
        } catch (e: any) {
            if (e.code === "ER_DUP_ENTRY" && e.sqlMessage.includes(UNIQUEConstraint.CLASS_STUDENT_CLASS_ROOM_STUDENT)) {
                throw new ConflictException(ClassRoomErrors.CLASSROOM_ALREADY_ENROLLED);
            }
            throw new InternalServerErrorException();
        }
    }

    async getMyClasses(
        studentId: number,
        filters: FilterClassRoomDto,
        sort: ISort<ClassRoom>,
        pagination: IPagination,
        keyword: string,
    ): Promise<IPaginatedResponse<ClassRoom> | ClassRoom[]> {
        let response = await this.classRoomService.getMany({
            pagination,
            sort,
            filters: { status: Status.ACTIVE, ...filters },
            search: keyword ? { name: keyword } : {},
            where: { classStudents: { student: { id: studentId } } },
            relations: classRoomRelations,
        });
        let classes = Array.isArray(response) ? response : response.data;
        classes = classes.map(
            (classRoom) => ({ ...classRoom, isPaid: this.isPaid(studentId, classRoom) } as ClassRoom),
        );
        return Array.isArray(response) ? classes : { ...response, data: classes };
    }

    async getClass(id: number, studentId: number): Promise<ClassRoom> {
        let classRoom = await this.classRoomService.get(id, { relations: classRoomRelationsAll });
        return { ...classRoom, isPaid: this.isPaid(studentId, classRoom) } as ClassRoom;
    }

    isPaid(id: number, classRoom: ClassRoom): boolean {
        return Boolean(
            !Number(classRoom.payment) ||
                classRoom.classStudents
                    ?.find((cs) => cs.studentId === id)
                    ?.payments?.find((p) => isThisMonth(p.fromDate) && p.status === PaymentStatus.PAID),
        );
    }

    async getClassMessages(id: number, sort: ISort<ClassRoom>): Promise<IPaginatedResponse<Message> | Message[]> {
        return await this.messageService.getMany({
            sort,
            where: { chatRoom: { classRoom: { id } } },
            relations: classRoomRelations,
        });
    }

    async getAssessment(studentId: number, id: number): Promise<Assessment> {
        let assessment = await this.assessmentService.get(id, { relations: ["submissions"] });
        assessment.submission = assessment.submissions.find((s) => s.studentId === studentId);
        return assessment;
    }

    async submitAssessment(
        userId: number,
        id: number,
        submitAssessmentDto: SubmitAssessmentDto,
    ): Promise<AssessmentSubmission> {
        let assessmentSubmission = await this.assessmentSubmissionService.save({
            studentId: userId,
            assessmentId: id,
            answers: submitAssessmentDto.answers,
        });
        await this.socketService.sendMessage(AppEvent.ASSESSMENT_SUBMITTED, assessmentSubmission, userId);
        return assessmentSubmission;
    }

    async unSubmitAssessment(user: User, id: number): Promise<AssessmentSubmission> {
        const assessmentSubmission = await this.assessmentSubmissionService.delete(id, user);
        await this.socketService.sendMessage(AppEvent.ASSESSMENT_UN_SUBMITTED, id, user.id);
        return assessmentSubmission;
    }
}
