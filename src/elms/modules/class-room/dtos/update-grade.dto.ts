import { IsOptional } from "class-validator";

export class UpdateGradeDto {
    @IsOptional()
    name: string;

    @IsOptional()
    description?: string;
}
