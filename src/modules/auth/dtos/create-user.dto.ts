import { IsEmpty, IsEnum, IsNotEmpty, IsNumber, IsOptional } from "class-validator";
import { UserErrors } from "../responses";
import { toErrString } from "src/core/converters";
import { GuardianRelationship } from "../../../elms/modules/class-room/enums";

export class CreateUserDto {
    @IsNotEmpty(toErrString(UserErrors.USER_400_EMPTY_USERNAME))
    username: string;

    @IsNotEmpty(toErrString(UserErrors.USER_400_EMPTY_PASSWORD))
    password: string;

    @IsNotEmpty(toErrString(UserErrors.USER_400_EMPTY_FIRST_NAME))
    firstName: string;

    @IsNotEmpty(toErrString(UserErrors.USER_400_EMPTY_LAST_NAME))
    lastName: string;

    @IsNotEmpty(toErrString(UserErrors.USER_400_EMPTY_EMAIL))
    email: string;

    @IsNotEmpty(toErrString(UserErrors.USER_400_EMPTY_DOB))
    dob: Date;

    @IsNotEmpty(toErrString(UserErrors.USER_400_EMPTY_PHONE))
    phone: string;

    @IsNotEmpty(toErrString(UserErrors.USER_400_EMPTY_AREA_ID))
    @IsNumber({}, toErrString(UserErrors.USER_400_INVALID_AREA_ID))
    areaId: number;

    @IsNotEmpty(toErrString(UserErrors.USER_400_EMPTY_ADDRESS))
    address: string;

    @IsOptional()
    school: string;

    @IsNotEmpty(toErrString(UserErrors.USER_400_EMPTY_GUARDIAN_NAME))
    guardianName: string;

    @IsNotEmpty(toErrString(UserErrors.USER_400_EMPTY_GUARDIAN_PHONE))
    guardianPhone: string;

    @IsOptional()
    guardianAddress: string;

    @IsNotEmpty(toErrString(UserErrors.USER_400_EMPTY_GUARDIAN_RELATIONSHIP))
    @IsEnum(GuardianRelationship, toErrString(UserErrors.USER_400_INVALID_GUARDIAN_RELATIONSHIP))
    guardianRelationship: GuardianRelationship;

    @IsEmpty(toErrString(UserErrors.USER_400_NOT_EMPTY_TUTOR_ID))
    tutorId?: number;
}
