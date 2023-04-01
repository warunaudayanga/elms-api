import { IsEnum, IsNotEmpty } from "class-validator";
import { Status } from "../enums";
import { toErrString } from "../converters";
import { CommonErrors } from "../responses";

export class UpdateStatusDto {
    @IsEnum(Object.values(Status), toErrString(CommonErrors.E_400_INVALID_STATUS))
    @IsNotEmpty(toErrString(CommonErrors.E_400_EMPTY_STATUS))
    status: Status;
}
