import { IsNotEmpty } from "class-validator";
import { toErrString } from "../../../../core/converters";
import { ClassRoomErrors } from "../responses";

export class EnrollClassDto {
    @IsNotEmpty(toErrString(ClassRoomErrors.CLASS_ROOM_400_EMPTY_CLASS_ROOM_ID))
    classRoomId: number;
}
