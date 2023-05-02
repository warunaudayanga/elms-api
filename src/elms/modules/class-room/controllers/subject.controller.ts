import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from "@nestjs/common";
import { ReqUser, Roles } from "../../../../core/decorators";
import { BulkDeleteDto, UpdateStatusDto } from "../../../../core/dtos";
import { IStatusResponse } from "../../../../core/entity";
import { Endpoint, Status } from "../../../../core/enums";
import { RoleGuard } from "../../../../core/guards/role.guard";
import { User } from "../../../../modules/auth/entities";
import { Role } from "../../../../modules/auth/enums";
import { JwtAuthGuard } from "../../../../modules/auth/guards";
import { CreateSubjectDto, UpdateSubjectDto } from "../dtos";
import { ClassSubject } from "../entities/subject.entity";
import { ClassSubjectService } from "../services";

@Controller(Endpoint.SUBJECT)
export class ClassSubjectController {
    constructor(private readonly classSubjectService: ClassSubjectService) {}

    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(Role.SUPER_ADMIN, Role.ADMIN)
    @Post()
    create(@ReqUser() createdBy: User, @Body() createClassSubjectDto: CreateSubjectDto): Promise<ClassSubject> {
        return this.classSubjectService.save({ ...createClassSubjectDto, status: Status.ACTIVE, createdBy });
    }

    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(Role.SUPER_ADMIN, Role.ADMIN)
    @Patch(":id")
    update(
        @ReqUser() updatedBy: User,
        @Param("id", ParseIntPipe) id: number,
        @Body() updateClassSubjectDto: UpdateSubjectDto,
    ): Promise<ClassSubject> {
        return this.classSubjectService.update(id, { ...updateClassSubjectDto, updatedBy });
    }

    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(Role.SUPER_ADMIN, Role.ADMIN)
    @Patch(":id/status")
    updateStatus(
        @Param("id", ParseIntPipe) id: number,
        @Body() updateStatusDto: UpdateStatusDto,
    ): Promise<ClassSubject> {
        const { status } = updateStatusDto;
        return this.classSubjectService.update(id, { status });
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    getAll(): Promise<ClassSubject[]> {
        return this.classSubjectService.getWithoutPage();
    }

    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(Role.SUPER_ADMIN, Role.ADMIN)
    @Delete(":id")
    delete(@ReqUser() deletedBy: User, @Param("id", ParseIntPipe) id: number): Promise<ClassSubject> {
        return this.classSubjectService.delete(id, deletedBy);
    }

    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(Role.SUPER_ADMIN, Role.ADMIN)
    @Post("delete-many")
    deleteSelected(@ReqUser() deletedBy: User, @Body() bulkDeleteDto: BulkDeleteDto): Promise<IStatusResponse> {
        const { ids } = bulkDeleteDto;
        return this.classSubjectService.deleteByIds(ids, deletedBy);
    }
}
