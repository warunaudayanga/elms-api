import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityService } from "src/core/entity";
import { SocketService } from "src/modules/socket/services/socket.service";
import { Assessment } from "../entities";
import { AssessmentRepository } from "../repositories";

@Injectable()
export class AssessmentService extends EntityService<Assessment> {
    constructor(
        @InjectRepository(AssessmentRepository) private readonly assessmentRepository: AssessmentRepository,
        protected readonly socketService: SocketService,
    ) {
        super(socketService, assessmentRepository, "assessment");
    }
}
