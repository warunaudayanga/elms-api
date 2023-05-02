import { MessageType } from "../enums/message-type.enum";
import { IsEnum, IsNotEmpty } from "class-validator";
import { toErrString } from "../../../../core/converters";
import { MessageErrors } from "../responses/message.error.responses";

export class CreateMessageDto {
    @IsNotEmpty(toErrString(MessageErrors.MESSAGE_400_EMPTY_CHATROOM_ID))
    chatRoomId: number;

    @IsEnum(MessageType, toErrString(MessageErrors.MESSAGE_400_INVALID_TYPE))
    @IsNotEmpty(toErrString(MessageErrors.MESSAGE_400_EMPTY_TYPE))
    type: MessageType;

    @IsNotEmpty(toErrString(MessageErrors.MESSAGE_400_EMPTY_MESSAGE))
    message: string;
}
