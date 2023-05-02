import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { Pager, ReqUser, Roles, Sorter } from "../../../../core/decorators";
import { BulkDeleteDto, UpdateStatusDto } from "../../../../core/dtos";
import { IPaginatedResponse, IPagination, ISort, IStatusResponse } from "../../../../core/entity";
import { Endpoint, Status } from "../../../../core/enums";
import { RoleGuard } from "../../../../core/guards/role.guard";
import { User } from "../../../../modules/auth/entities";
import { Role } from "../../../../modules/auth/enums";
import { JwtAuthGuard } from "../../../../modules/auth/guards";
import { CreateGradeDto, FilterClassRoomDto, UpdateGradeDto } from "../dtos";
import { Grade } from "../entities/grade.entity";
import { GradeService } from "../services";

@Controller(Endpoint.GRADE)
export class GradeController {
    constructor(private readonly gradeService: GradeService) {}

    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(Role.SUPER_ADMIN, Role.ADMIN)
    @Post()
    create(@ReqUser() createdBy: User, @Body() createGradeDto: CreateGradeDto): Promise<Grade> {
        return this.gradeService.save({ ...createGradeDto, status: Status.ACTIVE, createdBy });
    }

    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(Role.SUPER_ADMIN, Role.ADMIN)
    @Patch(":id")
    update(
        @ReqUser() updatedBy: User,
        @Param("id", ParseIntPipe) id: number,
        @Body() updateGradeDto: UpdateGradeDto,
    ): Promise<Grade> {
        return this.gradeService.update(id, { ...updateGradeDto, updatedBy });
    }

    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(Role.SUPER_ADMIN, Role.ADMIN)
    @Patch(":id/status")
    updateStatus(@Param("id", ParseIntPipe) id: number, @Body() updateStatusDto: UpdateStatusDto): Promise<Grade> {
        const { status } = updateStatusDto;
        return this.gradeService.update(id, { status });
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    getAll(
        @Query() filters: FilterClassRoomDto,
        @Sorter() sort: ISort<User>,
        @Pager() pagination?: IPagination,
        @Query("keyword") keyword?: string,
    ): Promise<IPaginatedResponse<Grade> | Grade[]> {
        return this.gradeService.getMany({
            pagination,
            sort,
            filters,
            search: keyword ? { name: keyword } : {},
        });
    }

    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(Role.SUPER_ADMIN, Role.ADMIN)
    @Delete(":id")
    delete(@ReqUser() deletedBy: User, @Param("id", ParseIntPipe) id: number): Promise<Grade> {
        return this.gradeService.delete(id, deletedBy);
    }

    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(Role.SUPER_ADMIN, Role.ADMIN)
    @Post("delete-many")
    deleteSelected(@ReqUser() deletedBy: User, @Body() bulkDeleteDto: BulkDeleteDto): Promise<IStatusResponse> {
        const { ids } = bulkDeleteDto;
        return this.gradeService.deleteByIds(ids, deletedBy);
    }
}
