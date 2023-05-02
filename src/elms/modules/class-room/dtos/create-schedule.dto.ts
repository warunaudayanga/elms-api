import { IsEnum, IsNotEmpty, IsNumber, Matches } from "class-validator";
import { toErrString } from "../../../../core/converters";
import { Day } from "../../../../core/enums";
import { ScheduleErrors } from "../responses";

export class CreateScheduleDto {
    @IsEnum(Day, toErrString(ScheduleErrors.SCHEDULE_400_INVALID_DAY))
    @IsNotEmpty(toErrString(ScheduleErrors.SCHEDULE_400_EMPTY_DAY))
    day: Day;

    @Matches(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/, toErrString(ScheduleErrors.SCHEDULE_400_INVALID_START_TIME))
    @IsNotEmpty(toErrString(ScheduleErrors.SCHEDULE_400_EMPTY_START_TIME))
    startTime: string;

    @Matches(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/, toErrString(ScheduleErrors.SCHEDULE_400_INVALID_END_TIME))
    @IsNotEmpty(toErrString(ScheduleErrors.SCHEDULE_400_EMPTY_END_TIME))
    endTime: string;

    @IsNumber(undefined, toErrString(ScheduleErrors.SCHEDULE_400_INVALID_CLASS_ROOM_ID))
    @IsNotEmpty(toErrString(ScheduleErrors.SCHEDULE_400_EMPTY_CLASS_ROOM_ID))
    classRoomId: number;
}
