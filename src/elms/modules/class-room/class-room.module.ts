import { Module } from "@nestjs/common";
import { TypeOrmExModule } from "../../../modules";
import { ZoomModule } from "../zoom/zoom.module";
import {
    AssessmentController,
    ClassRoomController,
    ClassScheduleController,
    ClassSubjectController,
    CommonController,
    GradeController,
    StudentController,
    TutorController,
} from "./controllers";
import { AssessmentSubmissionController } from "./controllers/assessment-submission.controller";
import { Area } from "./entities/area.entity";
import { AssessmentSubmission } from "./entities/assessment-submissions.entity";
import { Assessment } from "./entities/assessment.entity";
import { ChatRoom } from "./entities/chat-room.entity";
import { ClassRoom } from "./entities/class-room.entity";
import { ClassStudent } from "./entities/class-students.entity";
import { Grade } from "./entities/grade.entity";
import { MessageUserStatus } from "./entities/message-user-status.entity";
import { Message } from "./entities/message.entity";
import { ClassScheduleHistory } from "./entities/schedule-history.entity";
import { ClassSchedule } from "./entities/schedule.entity";
import { ClassSubject } from "./entities/subject.entity";
import { Tutor } from "./entities/tutor.entity";
import {
    AreaRepository,
    AssessmentRepository,
    ChatRoomRepository,
    ClassRoomRepository,
    ClassScheduleHistoryRepository,
    ClassScheduleRepository,
    ClassStudentsRepository,
    ClassSubjectRepository,
    GradeRepository,
    MessageRepository,
    MessageUserStatusRepository,
    TutorRepository,
} from "./repositories";
import { AssessmentSubmissionRepository } from "./repositories/assessment-submission.repository";
import {
    AreaService,
    AssessmentService,
    AssessmentSubmissionService,
    ChatRoomService,
    ClassRoomService,
    ClassSubjectService,
    GradeService,
    MessageService,
    ScheduleService,
    StudentService,
    TutorService,
} from "./services";
import { Notification } from "./entities/notification.entity";
import { NotificationRepository } from "./repositories/notification.repository";
import { NotificationService } from "./services/notification.service";
import { PaymentModule } from "../payment/payment.module";

@Module({
    imports: [
        TypeOrmExModule.forCustomRepository([
            ClassRoom,
            ClassRoomRepository,
            ClassStudent,
            ClassStudentsRepository,
            Grade,
            GradeRepository,
            ClassSchedule,
            ClassScheduleRepository,
            ClassScheduleHistory,
            ClassScheduleHistoryRepository,
            ClassSubject,
            ClassSubjectRepository,
            Tutor,
            TutorRepository,
            Area,
            AreaRepository,
            ChatRoom,
            ChatRoomRepository,
            Message,
            MessageRepository,
            MessageUserStatus,
            MessageUserStatusRepository,
            Assessment,
            AssessmentRepository,
            AssessmentSubmission,
            AssessmentSubmissionRepository,
            Notification,
            NotificationRepository,
        ]),
        PaymentModule,
        ZoomModule,
    ],
    controllers: [
        CommonController,
        ClassRoomController,
        GradeController,
        ClassScheduleController,
        ClassSubjectController,
        StudentController,
        TutorController,
        AssessmentController,
        AssessmentSubmissionController,
    ],
    providers: [
        ClassRoomService,
        GradeService,
        ScheduleService,
        TutorService,
        ClassSubjectService,
        AreaService,
        StudentService,
        ChatRoomService,
        MessageService,
        AssessmentService,
        AssessmentSubmissionService,
        NotificationService,
    ],
})
export class ClassRoomModule {}
