import { CustomRepository } from "../../../../modules/typeorm-ex/decorators";
import { BaseRepository, relations } from "../../../../core/entity";
import { IClassScheduleRepository } from "../interfaces/repositories";
import { ClassSchedule } from "../entities";

export const classScheduleRelations = ["classRoom", ...relations];

@CustomRepository(ClassSchedule)
export class ClassScheduleRepository extends BaseRepository<ClassSchedule> implements IClassScheduleRepository {}
