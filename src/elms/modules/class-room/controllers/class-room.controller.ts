import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Query,
    UseGuards,
} from "@nestjs/common";
import { Endpoint } from "../../../../core/enums";
import { JwtAuthGuard } from "../../../../modules/auth/guards";
import { Pager, ReqUser, Roles, Sorter } from "../../../../core/decorators";
import { IPaginatedResponse, IPagination, ISort, IStatusResponse } from "../../../../core/entity";
import { BulkDeleteDto, UpdateStatusDto } from "../../../../core/dtos";
import { RoleGuard } from "../../../../core/guards/role.guard";
import { Role } from "../../../../modules/auth/enums";
import { User } from "../../../../modules/auth/entities";
import { ClassRoom } from "../entities/class-room.entity";
import { ClassRoomService } from "../services";
import { CreateClassRoomDto, UpdateClassRoomDto, FilterClassRoomDto } from "../dtos";
import { classRoomRelationsAll } from "../repositories";
import { ClassRoomErrors } from "../responses";

@Controller(Endpoint.CLASS_ROOM)
export class ClassRoomController {
    constructor(private readonly classRoomService: ClassRoomService) {}

    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(Role.SUPER_ADMIN, Role.ADMIN)
    @Post()
    create(@ReqUser() createdBy: User, @Body() createClassRoomDto: CreateClassRoomDto): Promise<ClassRoom> {
        if (!createClassRoomDto.tutorId) {
            throw new BadRequestException(ClassRoomErrors.CLASS_ROOM_400_EMPTY_TUTOR_ID);
        }
        const tutorId = createClassRoomDto.tutorId || createdBy.tutorId;
        return this.classRoomService.createCLassRoom({ ...createClassRoomDto, tutorId, createdBy });
    }

    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(Role.SUPER_ADMIN, Role.ADMIN)
    @Patch(":id")
    update(
        @ReqUser() user: User,
        @Param("id", ParseIntPipe) id: number,
        @Body() updateClassRoomDto: UpdateClassRoomDto,
    ): Promise<ClassRoom> {
        return this.classRoomService.updateClassRoom(
            user.id,
            id,
            { ...updateClassRoomDto, updatedBy: user },
            { relations: classRoomRelationsAll },
        );
    }

    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(Role.SUPER_ADMIN, Role.ADMIN)
    @Patch(":id/status")
    updateStatus(
        @ReqUser() user: User,
        @Param("id", ParseIntPipe) id: number,
        @Body() updateStatusDto: UpdateStatusDto,
    ): Promise<ClassRoom> {
        const { status } = updateStatusDto;
        return this.classRoomService.updateClassRoom(user.id, id, { status }, { relations: classRoomRelationsAll });
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    getAll(
        @Query() filters: FilterClassRoomDto,
        @Sorter() sort: ISort<User>,
        @Pager() pagination?: IPagination,
        @Query("keyword") keyword?: string,
    ): Promise<IPaginatedResponse<ClassRoom> | ClassRoom[]> {
        return this.classRoomService.getMany({
            pagination,
            sort,
            filters: { ...filters },
            search: keyword ? { name: keyword } : {},
            relations: classRoomRelationsAll,
        });
    }

    @UseGuards(JwtAuthGuard)
    @Get(":id")
    getById(@Param("id", ParseIntPipe) id: number): Promise<ClassRoom> {
        return this.classRoomService.get(id, { relations: classRoomRelationsAll });
    }

    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(Role.SUPER_ADMIN, Role.ADMIN)
    @Delete(":id")
    delete(@ReqUser() deletedBy: User, @Param("id", ParseIntPipe) id: number): Promise<ClassRoom> {
        return this.classRoomService.delete(id, deletedBy);
    }

    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(Role.SUPER_ADMIN, Role.ADMIN)
    @Post("delete-many")
    deleteSelected(@ReqUser() deletedBy: User, @Body() bulkDeleteDto: BulkDeleteDto): Promise<IStatusResponse> {
        const { ids } = bulkDeleteDto;
        return this.classRoomService.deleteByIds(ids, deletedBy);
    }

    // @UseGuards(JwtAuthGuard, RoleGuard)
    // @Roles(Role.STUDENT, Role.ADMIN)
    // @Get(":id/enroll")
    // enrollStudent(@Param("id", ParseIntPipe) id: number, @Body() enrollDto: EnrollStudentDto): Promise<ClassStudent> {
    //     return this.classRoomService.enrollStudent(id, enrollDto);
    // }
}
