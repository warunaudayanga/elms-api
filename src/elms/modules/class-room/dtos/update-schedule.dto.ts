import { IsEnum, IsOptional, Matches } from "class-validator";
import { toErrString } from "../../../../core/converters";
import { Day } from "../../../../core/enums";
import { ScheduleErrors } from "../responses";

export class UpdateScheduleDto {
    @IsEnum(Day, toErrString(ScheduleErrors.SCHEDULE_400_INVALID_DAY))
    @IsOptional()
    day: Day;

    @Matches(
        /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/,
        toErrString(ScheduleErrors.SCHEDULE_400_INVALID_START_TIME),
    )
    @IsOptional()
    startTime: string;

    @Matches(
        /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/,
        toErrString(ScheduleErrors.SCHEDULE_400_INVALID_END_TIME),
    )
    @IsOptional()
    endTime: string;

    @IsOptional()
    changeRequest: null;
}
