import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Role } from "../entities/role.entity";
import { RoleRepository } from "../repositories";
import { EntityService } from "src/core/entity";
import { SocketService } from "src/modules/socket/services/socket.service";

@Injectable()
export class RoleService extends EntityService<Role> {
    constructor(
        @InjectRepository(RoleRepository) private readonly roleRepository: RoleRepository,
        protected readonly socketService: SocketService,
    ) {
        super(socketService, roleRepository, "role", "name");
    }
}
