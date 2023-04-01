import { IsNotEmpty } from "class-validator";
import { UserErrors } from "../responses";
import { toErrString } from "src/core/converters";
import { CreateProfileDto } from "../../../elms/modules/profile/dtos/create-profile.dto";

export class CreateUserDto extends CreateProfileDto {
    @IsNotEmpty(toErrString(UserErrors.USER_400_EMPTY_USERNAME))
    username: string;

    @IsNotEmpty(toErrString(UserErrors.USER_400_EMPTY_PASSWORD))
    password: string;
}
