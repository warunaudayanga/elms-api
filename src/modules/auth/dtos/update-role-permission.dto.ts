import { IsArray, IsNotEmpty } from "class-validator";
import { RoleErrors } from "../responses";
import { Permission } from "src/core/enums";
import { toErrString } from "src/core/converters";

export class UpdateRolePermissionDto {
    @IsArray(toErrString(RoleErrors.ROLE_400_INVALID_PERMISSIONS))
    @IsNotEmpty(toErrString(RoleErrors.ROLE_400_EMPTY_PERMISSIONS))
    permissions: Permission[];
}
