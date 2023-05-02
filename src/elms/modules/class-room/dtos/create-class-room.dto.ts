import { IsNotEmpty, IsOptional } from "class-validator";
import { toErrString } from "../../../../core/converters";
import { ClassRoomErrors } from "../responses";

export class CreateClassRoomDto {
    @IsNotEmpty(toErrString(ClassRoomErrors.CLASS_ROOM_400_EMPTY_NAME))
    name: string;

    @IsOptional()
    description?: string;

    @IsNotEmpty(toErrString(ClassRoomErrors.CLASS_ROOM_400_EMPTY_PAYMENT))
    payment: number;

    @IsNotEmpty(toErrString(ClassRoomErrors.CLASS_ROOM_400_EMPTY_GRADE_ID))
    gradeId: number;

    @IsNotEmpty(toErrString(ClassRoomErrors.CLASS_ROOM_400_EMPTY_SUBJECT_ID))
    subjectId: number;

    @IsOptional()
    tutorId?: number;
}
