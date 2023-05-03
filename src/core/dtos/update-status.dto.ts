import { IsEnum, IsNotEmpty } from "class-validator";
import { Status } from "../enums";
import { toErrString } from "../converters";
import { Errors } from "../responses";

export class UpdateStatusDto {
    @IsEnum(Object.values(Status), toErrString(Errors.E_400_INVALID_STATUS))
    @IsNotEmpty(toErrString(Errors.E_400_EMPTY_STATUS))
    status: Status;
}
