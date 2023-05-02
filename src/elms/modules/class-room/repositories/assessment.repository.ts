import { CustomRepository } from "../../../../modules/typeorm-ex/decorators";
import { BaseRepository } from "src/core/entity";
import { Assessment } from "../entities";
import { IAssessmentRepository } from "../interfaces/repositories/assessment.repository.interface";

// noinspection JSUnusedGlobalSymbols
export const assessmentRelations = ["submissions"];

@CustomRepository(Assessment)
export class AssessmentRepository extends BaseRepository<Assessment> implements IAssessmentRepository {}
