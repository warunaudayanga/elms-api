import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityService } from "src/core/entity";
import { SocketService } from "src/modules/socket/services/socket.service";
import { Area } from "../entities";
import { AreaRepository } from "../repositories";

@Injectable()
export class AreaService extends EntityService<Area> {
    constructor(
        @InjectRepository(AreaRepository) private readonly gradeRepository: AreaRepository,
        protected readonly socketService: SocketService,
    ) {
        super(socketService, gradeRepository, "area", "name");
    }
}
