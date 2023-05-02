import { IsOptional } from "class-validator";

export class UpdateClassRoomDto {
    @IsOptional()
    name?: string;

    @IsOptional()
    description?: string;

    @IsOptional()
    payment?: number;

    @IsOptional()
    changeRequest?: null;

    @IsOptional()
    gradeId?: number;

    @IsOptional()
    subjectId?: number;

    @IsOptional()
    tutorId?: number;
}
