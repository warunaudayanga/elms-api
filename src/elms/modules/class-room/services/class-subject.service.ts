import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityService } from "src/core/entity";
import { SocketService } from "src/modules/socket/services/socket.service";
import { ClassSubject } from "../entities";
import { ClassSubjectRepository } from "../repositories";

@Injectable()
export class ClassSubjectService extends EntityService<ClassSubject> {
    constructor(
        @InjectRepository(ClassSubjectRepository) private readonly subjectRepository: ClassSubjectRepository,
        protected readonly socketService: SocketService,
    ) {
        super(socketService, subjectRepository, "subject", "name");
    }
}
