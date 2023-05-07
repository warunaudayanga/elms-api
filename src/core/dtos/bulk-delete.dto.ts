import { IsArray, IsNotEmpty } from "class-validator";
import { toErrString } from "../converters";
import { Errors } from "../responses";

export class BulkDeleteDto {
    @IsArray(toErrString(Errors.E_400_INVALID_IDS))
    @IsNotEmpty(toErrString(Errors.E_400_EMPTY_IDS))
    ids: number[];
}
