import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { User } from "../entities";
import { UpdateUserDto, CreateUserDto, UpdateMeDto, UpdateUserRoleDto } from "../dtos";
import { Pager, ReqUser, Roles, Sorter } from "../../../core/decorators";
import { IPaginatedResponse, IPagination, ISort, IStatusResponse } from "../../../core/entity";
import { Role } from "../enums";
import { Endpoint, Status } from "../../../core/enums";
import { BulkDeleteDto, UpdateStatusDto } from "../../../core/dtos";
import { JwtAuthGuard } from "../guards";
import { AuthService, UserService } from "../services";
import { RoleGuard } from "../../../core/guards/role.guard";
import { CreateTutorDto } from "../dtos/create-tutor.dto";
import { FilterUserDto } from "../../../elms/modules/class-room/dtos";
import { userRelations } from "../repositories";

@Controller(Endpoint.USER)
export class UserController {
    constructor(private readonly authService: AuthService, private readonly userService: UserService) {}

    @Post("tutor")
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(Role.SUPER_ADMIN, Role.ADMIN)
    async createTutor(@ReqUser() createdBy: User, @Body() createTutorDto: CreateTutorDto): Promise<User> {
        return await this.authService.createTutor(createTutorDto, createdBy);
    }

    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.STUDENT)
    @Get("tutor")
    async getAllTutors(
        @Query() filters: FilterUserDto,
        @Sorter() sort: ISort<User>,
        @Pager() pagination?: IPagination,
        @Query("keyword") keyword?: string,
    ): Promise<IPaginatedResponse<User> | User[]> {
        return await this.userService.getMany({
            pagination,
            sort,
            filters: { status: Status.ACTIVE, ...filters, role: Role.TUTOR },
            search: keyword ? { name: keyword } : {},
            relations: userRelations,
        });
    }

    @UseGuards(JwtAuthGuard)
    @Get("me")
    async getMe(@ReqUser() user: User): Promise<User> {
        return await this.get(user.id);
    }

    @UseGuards(JwtAuthGuard)
    @Roles(Role.SUPER_ADMIN, Role.ADMIN)
    @Get("count")
    async getCount(): Promise<number> {
        return await this.userService.count();
    }

    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(Role.SUPER_ADMIN, Role.ADMIN)
    @Get(":id")
    async get(@Param("id", ParseIntPipe) id: number): Promise<User> {
        return await this.userService.get(id, { relations: userRelations });
    }

    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(Role.SUPER_ADMIN, Role.ADMIN)
    @Get()
    async getAll(
        @Query() filters: FilterUserDto,
        @Sorter() sort: ISort<User>,
        @Pager() pagination?: IPagination,
        @Query("keyword") keyword?: string,
    ): Promise<IPaginatedResponse<User> | User[]> {
        return await this.userService.getAllUsers(filters, keyword, pagination, sort);
    }

    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(Role.SUPER_ADMIN, Role.ADMIN)
    @Post()
    async create(@ReqUser() createdBy: User, @Body() createUserDto: CreateUserDto): Promise<User> {
        return await this.authService.registerUser(createUserDto, createdBy);
    }

    @UseGuards(JwtAuthGuard)
    @Patch("me")
    async updateMe(@ReqUser() user: User, @Body() updateMeDto: UpdateMeDto): Promise<User> {
        return await this.update(user, user.id, updateMeDto);
    }

    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(Role.SUPER_ADMIN, Role.ADMIN)
    @Patch(":id")
    async update(
        @ReqUser() updatedBy: User,
        @Param("id", ParseIntPipe) id: number,
        @Body() updateUserDto: UpdateUserDto,
    ): Promise<User> {
        return await this.userService.updateUser(id, updateUserDto, updatedBy);
    }

    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(Role.SUPER_ADMIN, Role.ADMIN)
    @Patch(":id/role")
    async updateRole(
        @Param("id", ParseIntPipe) id: number,
        @Body() updateUserRoleDto: UpdateUserRoleDto,
    ): Promise<User> {
        const { role } = updateUserRoleDto;
        return await this.userService.update(id, { role });
    }

    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(Role.SUPER_ADMIN, Role.ADMIN)
    @Patch(":id/status")
    async updateStatus(@Param("id", ParseIntPipe) id: number, @Body() updateStatusDto: UpdateStatusDto): Promise<User> {
        const { status } = updateStatusDto;
        return await this.userService.update(id, { status });
    }

    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(Role.SUPER_ADMIN, Role.ADMIN)
    @Delete("wipe/:id")
    async wipe(@Param("id", ParseIntPipe) id: number): Promise<User> {
        return await this.userService.delete(id, undefined, true);
    }

    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(Role.SUPER_ADMIN, Role.ADMIN)
    @Delete("wipe")
    async wipeSelected(@Body() bulkDeleteDto: BulkDeleteDto): Promise<IStatusResponse> {
        const { ids } = bulkDeleteDto;
        return await this.userService.deleteByIds(ids, undefined, true);
    }

    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(Role.SUPER_ADMIN, Role.ADMIN)
    @Delete(":id")
    async delete(@ReqUser() deletedBy: User, @Param("id", ParseIntPipe) id: number): Promise<User> {
        return await this.userService.delete(id, deletedBy);
    }

    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(Role.SUPER_ADMIN, Role.ADMIN)
    @Post("delete-many")
    async deleteSelected(@ReqUser() deletedBy: User, @Body() bulkDeleteDto: BulkDeleteDto): Promise<IStatusResponse> {
        const { ids } = bulkDeleteDto;
        return await this.userService.deleteByIds(ids, deletedBy);
    }
}
