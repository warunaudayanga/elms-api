import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from "@nestjs/common";
import { Endpoint } from "../../../../core/enums";
import { JwtAuthGuard } from "../../../../modules/auth/guards";
import { ReqUser, Roles } from "../../../../core/decorators";
import { IStatusResponse } from "../../../../core/entity";
import { BulkDeleteDto, UpdateStatusDto } from "../../../../core/dtos";
import { RoleGuard } from "../../../../core/guards/role.guard";
import { Role } from "../../../../modules/auth/enums";
import { User } from "../../../../modules/auth/entities";
import { Assessment } from "../entities";
import { AssessmentService } from "../services";
import { CreateAssessmentDto, UpdateAssessmentDto } from "../dtos";

@Controller(Endpoint.ASSESSMENT)
export class AssessmentController {
    constructor(private readonly assessmentService: AssessmentService) {}

    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(Role.SUPER_ADMIN, Role.ADMIN)
    @Post()
    create(@ReqUser() createdBy: User, @Body() createAssessmentDto: CreateAssessmentDto): Promise<Assessment> {
        return this.assessmentService.save({ ...createAssessmentDto, createdBy });
    }

    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(Role.SUPER_ADMIN, Role.ADMIN)
    @Patch(":id")
    update(
        @ReqUser() updatedBy: User,
        @Param("id", ParseIntPipe) id: number,
        @Body() updateAssessmentDto: UpdateAssessmentDto,
    ): Promise<Assessment> {
        return this.assessmentService.update(id, { ...updateAssessmentDto, updatedBy });
    }

    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(Role.SUPER_ADMIN, Role.ADMIN)
    @Patch(":id/status")
    updateStatus(@Param("id", ParseIntPipe) id: number, @Body() updateStatusDto: UpdateStatusDto): Promise<Assessment> {
        const { status } = updateStatusDto;
        return this.assessmentService.update(id, { status });
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    getAll(): Promise<Assessment[]> {
        return this.assessmentService.getWithoutPage();
    }

    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(Role.SUPER_ADMIN, Role.ADMIN)
    @Delete(":id")
    delete(@ReqUser() deletedBy: User, @Param("id", ParseIntPipe) id: number): Promise<Assessment> {
        return this.assessmentService.delete(id, deletedBy);
    }

    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(Role.SUPER_ADMIN, Role.ADMIN)
    @Post("delete-many")
    deleteSelected(@ReqUser() deletedBy: User, @Body() bulkDeleteDto: BulkDeleteDto): Promise<IStatusResponse> {
        const { ids } = bulkDeleteDto;
        return this.assessmentService.deleteByIds(ids, deletedBy);
    }
}
