import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { Pager, ReqUser, Roles, Sorter } from "../../../../core/decorators";
import { BulkDeleteDto, UpdateStatusDto } from "../../../../core/dtos";
import { IPaginatedResponse, IPagination, ISort, IStatusResponse } from "../../../../core/entity";
import { Endpoint } from "../../../../core/enums";
import { RoleGuard } from "../../../../core/guards/role.guard";
import { User } from "../../../../modules/auth/entities";
import { Role } from "../../../../modules/auth/enums";
import { JwtAuthGuard } from "../../../../modules/auth/guards";
import { CreateScheduleDto, FilterClassRoomDto, UpdateScheduleDto } from "../dtos";
import { ClassSchedule } from "../entities/schedule.entity";
import { classScheduleRelations } from "../repositories";
import { ScheduleService } from "../services";

@Controller(Endpoint.CLASS_SCHEDULE)
export class ClassScheduleController {
    constructor(private readonly scheduleService: ScheduleService) {}

    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(Role.SUPER_ADMIN, Role.ADMIN)
    @Post()
    create(@ReqUser() createdBy: User, @Body() createScheduleDto: CreateScheduleDto): Promise<ClassSchedule> {
        return this.scheduleService.save({ ...createScheduleDto, createdBy });
    }

    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(Role.SUPER_ADMIN, Role.ADMIN)
    @Patch(":id")
    update(
        @ReqUser() user: User,
        @Param("id", ParseIntPipe) id: number,
        @Body() updateScheduleDto: UpdateScheduleDto,
    ): Promise<ClassSchedule> {
        return this.scheduleService.updateClassSchedule(user.id, id, updateScheduleDto);
    }

    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(Role.SUPER_ADMIN, Role.ADMIN)
    @Patch(":id/status")
    updateStatus(
        @ReqUser() user: User,
        @Param("id", ParseIntPipe) id: number,
        @Body() updateStatusDto: UpdateStatusDto,
    ): Promise<ClassSchedule> {
        const { status } = updateStatusDto;
        return this.scheduleService.updateClassSchedule(user.id, id, { status });
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    getAll(
        @Query() filters: FilterClassRoomDto,
        @Sorter() sort: ISort<User>,
        @Pager() pagination?: IPagination,
    ): Promise<IPaginatedResponse<ClassSchedule> | ClassSchedule[]> {
        return this.scheduleService.getMany({
            pagination,
            sort,
            filters,
            relations: classScheduleRelations,
        });
    }

    @UseGuards(JwtAuthGuard)
    @Get(":id")
    getById(@Param("id", ParseIntPipe) id: number): Promise<ClassSchedule> {
        return this.scheduleService.get(id, { relations: classScheduleRelations });
    }

    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(Role.SUPER_ADMIN, Role.ADMIN)
    @Delete(":id")
    delete(@ReqUser() deletedBy: User, @Param("id", ParseIntPipe) id: number): Promise<ClassSchedule> {
        return this.scheduleService.delete(id, deletedBy);
    }

    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(Role.SUPER_ADMIN, Role.ADMIN)
    @Post("delete-many")
    deleteSelected(@ReqUser() deletedBy: User, @Body() bulkDeleteDto: BulkDeleteDto): Promise<IStatusResponse> {
        const { ids } = bulkDeleteDto;
        return this.scheduleService.deleteByIds(ids, deletedBy);
    }
}
