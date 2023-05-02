import { IsEnum, IsNotEmpty } from "class-validator";
import { UserErrors } from "../responses";
import { toErrString } from "src/core/converters";
import { Role } from "../enums";

export class UpdateUserRoleDto {
    @IsEnum(Role, toErrString(UserErrors.USER_400_INVALID_ROLE))
    @IsNotEmpty(toErrString(UserErrors.USER_400_NOT_EMPTY_ROLE))
    role: Role;
}
