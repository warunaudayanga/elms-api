import { IsNotEmpty, IsOptional } from "class-validator";
import { GradeErrors } from "../responses";
import { toErrString } from "../../../../core/converters";

export class CreateGradeDto {
    @IsNotEmpty(toErrString(GradeErrors.GRADE_400_EMPTY_NAME))
    name: string;

    @IsOptional()
    description?: string;
}
