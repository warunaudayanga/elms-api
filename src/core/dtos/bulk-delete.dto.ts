import { IsArray, IsNotEmpty } from "class-validator";
import { toErrString } from "../converters";
import { CommonErrors } from "../responses";

export class BulkDeleteDto {
    @IsArray(toErrString(CommonErrors.E_400_INVALID_IDS))
    @IsNotEmpty(toErrString(CommonErrors.E_400_EMPTY_IDS))
    ids: number[];
}
