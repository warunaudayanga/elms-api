import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { User } from "../entities/user.entity";
import { Role } from "../entities/role.entity";
import { Pager, ReqUser, Roles, Sorter } from "../../../core/decorators";
import { IPaginatedResponse, IPagination, ISort, IStatusResponse } from "../../../core/entity";
import { DefaultRoles } from "../enums";
import { Endpoint, Permission, Status } from "../../../core/enums";
import { BulkDeleteDto, UpdateStatusDto } from "../../../core/dtos";
import { JwtAuthGuard } from "../guards";
import { CreateRoleDto, UpdateRolePermissionDto } from "../dtos";
import { PermissionGuard } from "../../../core/guards/permission.guard";
import { RoleService } from "../services";
import { relations } from "../../../core/config";

@Controller(Endpoint.ROLE)
export class RoleController {
    constructor(private roleService: RoleService) {}

    @UseGuards(JwtAuthGuard, PermissionGuard)
    @Roles(Permission.ROLE_GET_PERMISSIONS)
    @Get("permissions")
    getPermissions(): string[] {
        return Object.values(Permission);
    }

    @UseGuards(JwtAuthGuard, PermissionGuard)
    @Roles(Permission.ROLE_GET)
    @UseGuards(JwtAuthGuard)
    @Get(":id")
    get(@Param("id", ParseIntPipe) id: number): Promise<Role> {
        return this.roleService.get(id, { relations });
    }

    @UseGuards(JwtAuthGuard, PermissionGuard)
    @Roles(Permission.ROLE_GET)
    @Get()
    getAll(
        @Pager() pagination: IPagination,
        @Sorter() sort: ISort<Role>,
        @Query("status") status: Status,
    ): Promise<IPaginatedResponse<Role>> {
        return this.roleService.getMany({
            where: status ? { status } : {},
            not: { name: DefaultRoles.SUPER_ADMIN },
            relations,
            pagination,
            sort,
        });
    }

    @UseGuards(JwtAuthGuard, PermissionGuard)
    @Roles(Permission.ROLE_CREATE)
    @UseGuards(JwtAuthGuard)
    @Post()
    create(@ReqUser() createdBy: User, @Body() createRoleDto: CreateRoleDto): Promise<Role> {
        return this.roleService.create({ ...createRoleDto, createdBy });
    }

    @UseGuards(JwtAuthGuard, PermissionGuard)
    @Roles(Permission.ROLE_UPDATE_STATUS)
    @Patch(":id/status")
    updateStatus(
        @ReqUser() updatedBy: User,
        @Param("id", ParseIntPipe) id: number,
        @Body() updateStatusDto: UpdateStatusDto,
    ): Promise<IStatusResponse> {
        const { status } = updateStatusDto;
        return this.roleService.update(id, { status, updatedBy });
    }

    @UseGuards(JwtAuthGuard, PermissionGuard)
    @Roles(Permission.ROLE_UPDATE_PERMISSIONS)
    @Patch(":id/permissions")
    updatePermissions(
        @ReqUser() updatedBy: User,
        @Param("id", ParseIntPipe) id: number,
        @Body() updateRolePermissionDto: UpdateRolePermissionDto,
    ): Promise<IStatusResponse> {
        const { permissions } = updateRolePermissionDto;
        return this.roleService.update(id, { permissions, updatedBy });
    }

    @UseGuards(JwtAuthGuard, PermissionGuard)
    @Roles(Permission.ROLE_WIPE)
    @Delete("wipe/:id")
    wipe(@Param("id", ParseIntPipe) id: number): Promise<IStatusResponse> {
        return this.roleService.delete(id, undefined, true);
    }

    @UseGuards(JwtAuthGuard, PermissionGuard)
    @Roles(Permission.ROLE_WIPE)
    @Delete("wipe")
    wipeSelected(@Body() bulkDeleteDto: BulkDeleteDto): Promise<IStatusResponse> {
        const { ids } = bulkDeleteDto;
        return this.roleService.deleteByIds(ids, undefined, true);
    }

    @UseGuards(JwtAuthGuard, PermissionGuard)
    @Roles(Permission.USER_DELETE)
    @Delete(":id")
    delete(@ReqUser() deletedBy: User, @Param("id", ParseIntPipe) id: number): Promise<IStatusResponse> {
        return this.roleService.delete(id, deletedBy);
    }

    @UseGuards(JwtAuthGuard, PermissionGuard)
    @Roles(Permission.USER_DELETE)
    @Delete(":id")
    deleteSelected(
        @ReqUser() deletedBy: User,
        @Param("id", ParseIntPipe) id: number,
        @Body() bulkDeleteDto: BulkDeleteDto,
    ): Promise<IStatusResponse> {
        const { ids } = bulkDeleteDto;
        return this.roleService.deleteByIds(ids, deletedBy);
    }
}
