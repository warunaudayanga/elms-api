import { IsNotEmpty, IsNumber, IsOptional } from "class-validator";
import { UserErrors } from "../responses";
import { toErrString } from "src/core/converters";

export class UpdateTutorDto {
    @IsNotEmpty(toErrString(UserErrors.USER_400_EMPTY_FIRST_NAME))
    firstName: string;

    @IsNotEmpty(toErrString(UserErrors.USER_400_EMPTY_LAST_NAME))
    lastName: string;

    @IsNotEmpty(toErrString(UserErrors.USER_400_EMPTY_USERNAME))
    username: string;

    @IsNotEmpty(toErrString(UserErrors.USER_400_EMPTY_EMAIL))
    email: string;

    @IsNotEmpty(toErrString(UserErrors.USER_400_EMPTY_DOB))
    dob: Date;

    @IsNotEmpty(toErrString(UserErrors.USER_400_EMPTY_PHONE))
    phone: string;

    @IsNotEmpty(toErrString(UserErrors.USER_400_EMPTY_AREA_ID))
    @IsNumber(undefined, toErrString(UserErrors.USER_400_INVALID_AREA_ID))
    areaId: number;

    @IsNotEmpty(toErrString(UserErrors.USER_400_EMPTY_ADDRESS))
    address: string;

    @IsOptional()
    school: string;
}
