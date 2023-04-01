import { IsArray, IsNotEmpty, IsOptional } from "class-validator";
import { RoleErrors } from "../responses";
import { Permission } from "src/core/enums";
import { BaseDto } from "src/core/entity";
import { toErrString } from "src/core/converters";

export class CreateRoleDto extends BaseDto {
    @IsNotEmpty(toErrString(RoleErrors.ROLE_400_EMPTY_NAME))
    name: string;

    @IsNotEmpty(toErrString(RoleErrors.ROLE_400_EMPTY_NAME))
    priority: number;

    @IsArray(toErrString(RoleErrors.ROLE_400_INVALID_PERMISSIONS))
    @IsOptional()
    permissions?: Permission[];
}
