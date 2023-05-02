import { IsNotEmpty, IsOptional } from "class-validator";
import { toErrString } from "../../../../core/converters";
import { SubjectErrors } from "../responses";

export class CreateSubjectDto {
    @IsNotEmpty(toErrString(SubjectErrors.SUBJECT_400_EMPTY_NAME))
    name: string;

    @IsOptional()
    description: string;
}
