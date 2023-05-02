import { IsNotEmpty } from "class-validator";
import { ScheduleErrors } from "../responses";
import { toErrString } from "../../../../core/converters";
import { Day } from "../../../../core/enums";

export class SetScheduleDto {
    @IsNotEmpty(toErrString(ScheduleErrors.SCHEDULE_400_EMPTY_DAY))
    day: Day;

    @IsNotEmpty(toErrString(ScheduleErrors.SCHEDULE_400_EMPTY_START_TIME))
    startTime: string;

    @IsNotEmpty(toErrString(ScheduleErrors.SCHEDULE_400_EMPTY_END_TIME))
    endTime: string;
}
