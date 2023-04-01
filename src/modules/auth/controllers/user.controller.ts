import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { User } from "../entities/user.entity";
import { UpdateUserDto, CreateUserDto, UpdateMeDto, UpdateUserRoleDto } from "../dtos";
import { Pager, ReqUser, Roles, Sorter } from "../../../core/decorators";
import { IPaginatedResponse, IPagination, ISort, IStatusResponse } from "../../../core/entity";
import { DefaultRoles } from "../enums";
import { Endpoint, Permission, Status } from "../../../core/enums";
import { BulkDeleteDto, UpdateStatusDto } from "../../../core/dtos";
import { JwtAuthGuard } from "../guards";
import { AuthService, RoleService, userRelations, UserService } from "../services";
import { PermissionGuard } from "../../../core/guards/permission.guard";
import { relations } from "../../../core/config";

const rl = [...userRelations, ...relations];

@Controller(Endpoint.USER)
export class UserController {
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService,
        private readonly roleService: RoleService,
    ) {}

    @UseGuards(JwtAuthGuard)
    @Get("me")
    getMe(@ReqUser() user: User): Promise<User> {
        return this.get(user.id);
    }

    @UseGuards(JwtAuthGuard)
    @Get("count")
    async getCount(): Promise<number> {
        let { rowCount } = await this.userService.getMany({ where: { deletedAt: null } });
        return rowCount;
    }

    @UseGuards(JwtAuthGuard, PermissionGuard)
    @Roles(Permission.USER_GET)
    @Get(":id")
    get(@Param("id", ParseIntPipe) id: number): Promise<User> {
        return this.userService.get(id, { relations: rl });
    }

    @UseGuards(JwtAuthGuard, PermissionGuard)
    @Roles(Permission.USER_GET)
    @Get()
    async getAll(
        @Pager() pagination: IPagination,
        @Sorter() sort: ISort<User>,
        @Query("status") status: Status,
        @Query("keyword") keyword?: string,
    ): Promise<IPaginatedResponse<User>> {
        const role = await this.roleService.getOne({ where: { name: DefaultRoles.SUPER_ADMIN } });
        return this.userService.getMany({
            where: status ? { status } : {},
            search: { profile: { firstName: keyword ?? "" } },
            not: { role: { id: role.id } },
            relations: rl,
            pagination,
            sort,
        });
    }

    @UseGuards(JwtAuthGuard, PermissionGuard)
    @Roles(Permission.USER_CREATE)
    @Post()
    create(@ReqUser() createdBy: User, @Body() createUserDto: CreateUserDto): Promise<User> {
        return this.authService.registerUser(createUserDto, null, createdBy);
    }

    @UseGuards(JwtAuthGuard)
    @Patch("me")
    updateMe(@ReqUser() user: User, @Body() updateMeDto: UpdateMeDto): Promise<IStatusResponse> {
        return this.update(user, user.id, updateMeDto);
    }

    @UseGuards(JwtAuthGuard, PermissionGuard)
    @Roles(Permission.USER_UPDATE)
    @Patch(":id")
    update(
        @ReqUser() updatedBy: User,
        @Param("id", ParseIntPipe) id: number,
        @Body() updateUserDto: UpdateUserDto,
    ): Promise<IStatusResponse> {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { status, role, ...rest } = updateUserDto as User;
        if (rest.password) {
            const authData = AuthService.generatePassword(rest.password);
            rest.password = authData.password;
            rest.salt = authData.salt;
        }
        return this.userService.update(id, { ...rest, updatedBy });
    }

    @UseGuards(JwtAuthGuard, PermissionGuard)
    @Roles(Permission.USER_UPDATE_ROLE)
    @Patch(":id/role")
    updateRole(
        @Param("id", ParseIntPipe) id: number,
        @Body() updateUserRoleDto: UpdateUserRoleDto,
    ): Promise<IStatusResponse> {
        const { role } = updateUserRoleDto;
        return this.userService.update(id, { role });
    }

    @UseGuards(JwtAuthGuard, PermissionGuard)
    @Roles(Permission.USER_UPDATE_STATUS)
    @Patch(":id/status")
    updateStatus(
        @Param("id", ParseIntPipe) id: number,
        @Body() updateStatusDto: UpdateStatusDto,
    ): Promise<IStatusResponse> {
        const { status } = updateStatusDto;
        return this.userService.update(id, { status });
    }

    @UseGuards(JwtAuthGuard, PermissionGuard)
    @Roles(Permission.USER_WIPE)
    @Delete("wipe/:id")
    wipe(@Param("id", ParseIntPipe) id: number): Promise<IStatusResponse> {
        return this.userService.delete(id, undefined, true);
    }

    @UseGuards(JwtAuthGuard, PermissionGuard)
    @Roles(Permission.USER_WIPE)
    @Delete("wipe")
    wipeSelected(@Body() bulkDeleteDto: BulkDeleteDto): Promise<IStatusResponse> {
        const { ids } = bulkDeleteDto;
        return this.userService.deleteByIds(ids, undefined, true);
    }

    @UseGuards(JwtAuthGuard, PermissionGuard)
    @Roles(Permission.USER_DELETE)
    @Delete(":id")
    delete(@ReqUser() deletedBy: User, @Param("id", ParseIntPipe) id: number): Promise<IStatusResponse> {
        return this.userService.delete(id, deletedBy);
    }

    @UseGuards(JwtAuthGuard, PermissionGuard)
    @Roles(Permission.USER_DELETE)
    @Delete()
    deleteSelected(@ReqUser() deletedBy: User, @Body() bulkDeleteDto: BulkDeleteDto): Promise<IStatusResponse> {
        const { ids } = bulkDeleteDto;
        return this.userService.deleteByIds(ids, deletedBy);
    }
}
