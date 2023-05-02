import { CustomRepository } from "../../../../modules/typeorm-ex/decorators";
import { BaseRepository } from "../../../../core/entity";
import { ClassScheduleHistory } from "../entities";
import { IClassScheduleHistoryRepository } from "../interfaces/repositories";

@CustomRepository(ClassScheduleHistory)
export class ClassScheduleHistoryRepository
    extends BaseRepository<ClassScheduleHistory>
    implements IClassScheduleHistoryRepository {}
