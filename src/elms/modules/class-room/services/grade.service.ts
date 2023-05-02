import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityService } from "src/core/entity";
import { SocketService } from "src/modules/socket/services/socket.service";
import { Grade } from "../entities/grade.entity";
import { GradeRepository } from "../repositories";

@Injectable()
export class GradeService extends EntityService<Grade> {
    constructor(
        @InjectRepository(GradeRepository) private readonly gradeRepository: GradeRepository,
        protected readonly socketService: SocketService,
    ) {
        super(socketService, gradeRepository, "grade", "name");
    }
}
