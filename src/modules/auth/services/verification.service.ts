import { Injectable } from "@nestjs/common";
import { EntityService } from "../../../core/entity";
import { Verification } from "../entities";
import { InjectRepository } from "@nestjs/typeorm";
import { SocketService } from "../../socket/services";
import { VerificationRepository } from "../repositories/verification.repository";
import { EntityManager } from "typeorm";

@Injectable()
export class VerificationService extends EntityService<Verification> {
    constructor(
        @InjectRepository(VerificationRepository) private readonly verificationRepository: VerificationRepository,
        protected readonly socketService: SocketService,
    ) {
        super(socketService, verificationRepository, "verification");
    }

    async deleteToken(id: number, manager?: EntityManager): Promise<boolean> {
        await this.verificationRepository.hardDelete(id, manager);
        return true;
    }
}
