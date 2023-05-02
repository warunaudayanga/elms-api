import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from "@nestjs/common";
import { ReqUser, Roles } from "../../../../core/decorators";
import { BulkDeleteDto, UpdateStatusDto } from "../../../../core/dtos";
import { IStatusResponse } from "../../../../core/entity";
import { Endpoint } from "../../../../core/enums";
import { RoleGuard } from "../../../../core/guards/role.guard";
import { User } from "../../../../modules/auth/entities";
import { Role } from "../../../../modules/auth/enums";
import { JwtAuthGuard } from "../../../../modules/auth/guards";
import { CreateAssessmentSubmissionDto, UpdateAssessmentSubmissionDto } from "../dtos";
import { AssessmentSubmission } from "../entities/assessment-submissions.entity";
import { AssessmentSubmissionService } from "../services";

@Controller(Endpoint.ASSESSMENT_SUBMISSION)
export class AssessmentSubmissionController {
    constructor(private readonly assessmentSubmissionService: AssessmentSubmissionService) {}

    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(Role.SUPER_ADMIN, Role.ADMIN)
    @Post()
    create(
        @ReqUser() createdBy: User,
        @Body() createAssessmentSubmissionDto: CreateAssessmentSubmissionDto,
    ): Promise<AssessmentSubmission> {
        return this.assessmentSubmissionService.save({ ...createAssessmentSubmissionDto, createdBy });
    }

    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(Role.SUPER_ADMIN, Role.ADMIN)
    @Patch(":id")
    update(
        @ReqUser() updatedBy: User,
        @Param("id", ParseIntPipe) id: number,
        @Body() updateAssessmentSubmissionDto: UpdateAssessmentSubmissionDto,
    ): Promise<AssessmentSubmission> {
        return this.assessmentSubmissionService.update(id, { ...updateAssessmentSubmissionDto, updatedBy });
    }

    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(Role.SUPER_ADMIN, Role.ADMIN)
    @Patch(":id/status")
    updateStatus(
        @Param("id", ParseIntPipe) id: number,
        @Body() updateStatusDto: UpdateStatusDto,
    ): Promise<AssessmentSubmission> {
        const { status } = updateStatusDto;
        return this.assessmentSubmissionService.update(id, { status });
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    getAll(): Promise<AssessmentSubmission[]> {
        return this.assessmentSubmissionService.getWithoutPage();
    }

    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(Role.SUPER_ADMIN, Role.ADMIN)
    @Delete(":id")
    delete(@ReqUser() deletedBy: User, @Param("id", ParseIntPipe) id: number): Promise<AssessmentSubmission> {
        return this.assessmentSubmissionService.delete(id, deletedBy);
    }

    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(Role.SUPER_ADMIN, Role.ADMIN)
    @Post("delete-many")
    deleteSelected(@ReqUser() deletedBy: User, @Body() bulkDeleteDto: BulkDeleteDto): Promise<IStatusResponse> {
        const { ids } = bulkDeleteDto;
        return this.assessmentSubmissionService.deleteByIds(ids, deletedBy);
    }
}
