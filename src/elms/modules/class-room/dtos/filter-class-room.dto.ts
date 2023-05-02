import { IsOptional } from "class-validator";
import { Status } from "../../../../core/enums";

export class FilterClassRoomDto {
    @IsOptional()
    name: string;

    @IsOptional()
    status: Status;

    @IsOptional()
    gradeId: number;

    @IsOptional()
    subjectId: number;

    @IsOptional()
    tutorId: number;
}
