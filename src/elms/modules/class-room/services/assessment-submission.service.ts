import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityService } from "src/core/entity";
import { SocketService } from "src/modules/socket/services/socket.service";
import { AssessmentSubmission } from "../entities/assessment-submissions.entity";
import { AssessmentSubmissionRepository } from "../repositories/assessment-submission.repository";

@Injectable()
export class AssessmentSubmissionService extends EntityService<AssessmentSubmission> {
    constructor(
        @InjectRepository(AssessmentSubmissionRepository)
        private readonly assessmentSubmissionRepository: AssessmentSubmissionRepository,
        protected readonly socketService: SocketService,
    ) {
        super(socketService, assessmentSubmissionRepository, "assessmentSubmission");
    }
}
