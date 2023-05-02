import { CustomRepository } from "../../../../modules/typeorm-ex/decorators";
import { BaseRepository } from "../../../../core/entity";
import { Grade } from "../entities";
import { IGradeRepository } from "../interfaces/repositories";

@CustomRepository(Grade)
export class GradeRepository extends BaseRepository<Grade> implements IGradeRepository {}
