import { IsEnum, IsNotEmpty } from "class-validator";
import { toErrString } from "../../../../core/converters";
import { ZoomErrors } from "../../class-room/responses/zoom.error.responses";
import { ZoomMeetingRole } from "../../class-room/enums/zoom-meeting-role.enum";

export class GenerateSignatureDto {
    @IsNotEmpty(toErrString(ZoomErrors.ZOOM_400_EMPTY_MEETING_NUMBER))
    meetingNumber: number;

    @IsEnum(ZoomMeetingRole, toErrString(ZoomErrors.ZOOM_400_INVALID_ROLE))
    @IsNotEmpty(toErrString(ZoomErrors.ZOOM_400_EMPTY_ROLE))
    role: ZoomMeetingRole;
}
