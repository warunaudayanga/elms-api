import { IsOptional } from "class-validator";
import { Status } from "../../../../core/enums";
import { Role } from "../../../../modules/auth/enums";

export class FilterUserDto {
    @IsOptional()
    status: Status;

    @IsOptional()
    role: Role;
}
