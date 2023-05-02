import { IsOptional } from "class-validator";

export class CreateMeetingDto {
    @IsOptional()
    topic: string;
}
