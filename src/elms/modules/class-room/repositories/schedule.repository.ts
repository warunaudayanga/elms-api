import { CustomRepository } from "../../../../modules/typeorm-ex/decorators";
import { BaseRepository, relations } from "../../../../core/entity";
import { ClassSchedule } from "../entities/schedule.entity";
import { IClassScheduleRepository } from "../interfaces/repositories";

export const classScheduleRelations = ["classRoom", ...relations];

@CustomRepository(ClassSchedule)
export class ClassScheduleRepository extends BaseRepository<ClassSchedule> implements IClassScheduleRepository {}
