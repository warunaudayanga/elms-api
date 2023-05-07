import { IsNotEmpty } from "class-validator";

export class NotifyMeetingStartDto {
    @IsNotEmpty()
    classRoomId: number;
}
