import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Put, Query, UseGuards } from "@nestjs/common";
import { Endpoint } from "../../../../core/enums";
import { JwtAuthGuard } from "../../../../modules/auth/guards";
import { Pager, ReqUser, Roles, Sorter } from "../../../../core/decorators";
import { RoleGuard } from "../../../../core/guards/role.guard";
import { Role } from "../../../../modules/auth/enums";
import { User } from "../../../../modules/auth/entities";
import { IPaginatedResponse, IPagination, ISort } from "../../../../core/entity";
import {
    CreateAssessmentDto,
    CreateClassRoomDto,
    FilterClassRoomDto,
    SetScheduleDto,
    UpdateAssessmentDto,
    UpdateClassRoomDto,
} from "../dtos";
import { Assessment } from "../entities/assessment.entity";
import { ClassRoom } from "../entities/class-room.entity";
import { ClassSchedule } from "../entities/schedule.entity";
import { TutorService } from "../services";

@Controller(Endpoint.TUTOR)
export class TutorController {
    constructor(private readonly tutorService: TutorService) {}

    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(Role.TUTOR)
    @Get("classes")
    getMyClasses(
        @ReqUser() tutor: User,
        @Query() filters: FilterClassRoomDto,
        @Sorter() sort: ISort<ClassRoom>,
        @Pager() pagination?: IPagination,
        @Query("keyword") keyword?: string,
    ): Promise<IPaginatedResponse<ClassRoom> | ClassRoom[]> {
        return this.tutorService.getMyClasses(tutor.id, filters, sort, pagination, keyword);
    }

    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(Role.TUTOR)
    @Get("classes/:id")
    getClass(@ReqUser() user: User, @Param("id", ParseIntPipe) id: number): Promise<ClassRoom> {
        return this.tutorService.getClass(user.id, id);
    }

    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(Role.TUTOR)
    @Post("classes")
    requestClassCreate(@ReqUser() user: User, @Body() createClassRoomDto: CreateClassRoomDto): Promise<ClassRoom> {
        const tutorId = user.id;
        return this.tutorService.requestClassCreate(user.id, { ...createClassRoomDto, tutorId, createdBy: user });
    }

    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(Role.TUTOR)
    @Patch("classes/:id")
    requestClassUpdate(
        @Param("id", ParseIntPipe) id: number,
        @ReqUser() user: User,
        @Body() updateClassRoomDto: UpdateClassRoomDto,
    ): Promise<ClassRoom> {
        return this.tutorService.requestClassUpdate(user.id, id, updateClassRoomDto);
    }

    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(Role.TUTOR)
    @Put("classes/:id/schedule")
    requestClassScheduleSet(
        @Param("id", ParseIntPipe) classRoomId: number,
        @ReqUser() user: User,
        @Body() setScheduleDto: SetScheduleDto,
    ): Promise<ClassSchedule> {
        return this.tutorService.requestClassScheduleSet(user.id, classRoomId, setScheduleDto);
    }

    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(Role.TUTOR)
    @Get("classes/assessment/:id")
    getAssessment(@Param("id", ParseIntPipe) id: number): Promise<Assessment> {
        return this.tutorService.getSubmissions(id);
    }

    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(Role.TUTOR)
    @Post("classes/:id/assessment")
    createAssessment(
        @Param("id", ParseIntPipe) classRoomId: number,
        @ReqUser() user: User,
        @Body() createAssessmentDto: CreateAssessmentDto,
    ): Promise<Assessment> {
        return this.tutorService.createAssessment(user.id, classRoomId, createAssessmentDto);
    }

    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(Role.TUTOR)
    @Patch("classes/assessment/:id")
    updateAssessment(
        @Param("id", ParseIntPipe) id: number,
        @ReqUser() user: User,
        @Body() updateAssessmentDto: UpdateAssessmentDto,
    ): Promise<Assessment> {
        return this.tutorService.updateAssessment(user.id, id, updateAssessmentDto);
    }
}
