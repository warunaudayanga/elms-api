import { CustomRepository } from "../../../../modules/typeorm-ex/decorators";
import { BaseRepository } from "src/core/entity";
import { Assessment } from "../entities/assessment.entity";
import { IAssessmentRepository } from "../interfaces/repositories/assessment.repository.interface";

// noinspection JSUnusedGlobalSymbols
export const assessmentRelations = ["classRoom", "submissions", "submissions.student"];

@CustomRepository(Assessment)
export class AssessmentRepository extends BaseRepository<Assessment> implements IAssessmentRepository {}
