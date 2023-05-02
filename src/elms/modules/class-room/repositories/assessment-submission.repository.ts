import { CustomRepository } from "../../../../modules/typeorm-ex/decorators";
import { BaseRepository } from "src/core/entity";
import { AssessmentSubmission } from "../entities/assessment-submissions.entity";
import { IAssessmentSubmissionRepository } from "../interfaces/repositories/assessment-submission.repository.interface";

@CustomRepository(AssessmentSubmission)
export class AssessmentSubmissionRepository
    extends BaseRepository<AssessmentSubmission>
    implements IAssessmentSubmissionRepository {}
