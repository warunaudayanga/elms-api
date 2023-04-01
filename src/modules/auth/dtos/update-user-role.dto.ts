import { IsNotEmpty, IsObject } from "class-validator";
import { UserErrors } from "../responses";
import { toErrString } from "src/core/converters";
import { Role } from "../entities/role.entity";

export class UpdateUserRoleDto {
    @IsObject(toErrString(UserErrors.USER_400_INVALID_ROLE))
    @IsNotEmpty(toErrString(UserErrors.USER_400_NOT_EMPTY_ROLE))
    role: Role;
}
