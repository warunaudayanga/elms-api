import { Body, Controller, Get, Param, ParseIntPipe, Post, Query, UseGuards } from "@nestjs/common";
import { Pager, ReqUser, Roles, Sorter } from "../../../../core/decorators";
import { IPaginatedResponse, IPagination, ISort } from "../../../../core/entity";
import { Endpoint } from "../../../../core/enums";
import { RoleGuard } from "../../../../core/guards/role.guard";
import { User } from "../../../../modules/auth/entities";
import { Role } from "../../../../modules/auth/enums";
import { JwtAuthGuard } from "../../../../modules/auth/guards";
import { EnrollClassDto, FilterClassRoomDto } from "../dtos";
import { SubmitAssessmentDto } from "../dtos/submit-assessment.dto";
import { AssessmentSubmission } from "../entities/assessment-submissions.entity";
import { Assessment } from "../entities/assessment.entity";
import { ClassRoom } from "../entities/class-room.entity";
import { ClassStudent } from "../entities/class-students.entity";
import { Message } from "../entities/message.entity";
import { StudentService } from "../services";

@Controller(Endpoint.STUDENT)
export class StudentController {
    constructor(private readonly studentService: StudentService) {}

    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(Role.STUDENT)
    @Post("enroll")
    enroll(@ReqUser() student: User, @Body() enrollDto: EnrollClassDto): Promise<ClassStudent> {
        return this.studentService.enrollToClass(student.id, enrollDto.classRoomId);
    }

    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(Role.STUDENT)
    @Get("classes")
    getMyClasses(
        @ReqUser() student: User,
        @Query() filters: FilterClassRoomDto,
        @Sorter() sort: ISort<ClassRoom>,
        @Pager() pagination?: IPagination,
        @Query("keyword") keyword?: string,
    ): Promise<IPaginatedResponse<ClassRoom> | ClassRoom[]> {
        return this.studentService.getMyClasses(student.id, filters, sort, pagination, keyword);
    }

    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(Role.STUDENT)
    @Get("classes/:id")
    getClass(@ReqUser() student: User, @Param("id", ParseIntPipe) id: number): Promise<ClassRoom> {
        return this.studentService.getClass(id, student.id);
    }

    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(Role.STUDENT)
    @Get("classes/:id/messages")
    getClassMessages(
        @Param("id", ParseIntPipe) id: number,
        @ReqUser() student: User,
        @Sorter() sort: ISort<ClassRoom>,
    ): Promise<IPaginatedResponse<Message> | Message[]> {
        return this.studentService.getClassMessages(id, sort);
    }

    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(Role.STUDENT)
    @Get("classes/assessment/:id")
    getAssessment(@ReqUser() student: User, @Param("id", ParseIntPipe) id: number): Promise<Assessment> {
        return this.studentService.getAssessment(student.id, id);
    }

    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(Role.STUDENT)
    @Post("classes/assessment/:id")
    submitAssessment(
        @ReqUser() student: User,
        @Param("id", ParseIntPipe) id: number,
        @Body() submitAssessmentDto: SubmitAssessmentDto,
    ): Promise<AssessmentSubmission> {
        return this.studentService.submitAssessment(student.id, id, submitAssessmentDto);
    }

    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(Role.STUDENT)
    @Post("classes/assessment/:id/unsubmit")
    unSubmitAssessment(@ReqUser() user: User, @Param("id", ParseIntPipe) id: number): Promise<AssessmentSubmission> {
        return this.studentService.unSubmitAssessment(user, id);
    }
}
