import { Injectable } from "@nestjs/common";
import { EntityService, IStatusResponse } from "../../../core/entity";
import { User } from "../entities/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { UserRepository } from "../repositories";
import { SocketService } from "../../socket/services";
import { DeepPartial } from "typeorm/common/DeepPartial";
import { SaveOptions } from "typeorm";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
import { EH } from "../../../core/entity/entity.types";

@Injectable()
export class UserService extends EntityService<User> {
    constructor(
        @InjectRepository(UserRepository) private readonly userRepository: UserRepository,
        protected readonly socketService: SocketService,
    ) {
        super(socketService, userRepository, "user", "username");
    }

    async create<T extends DeepPartial<User>>(
        createDto: T,
        options?: SaveOptions,
        relations?: string[],
        eh?: EH,
    ): Promise<User> {
        return await super.create(createDto, options, [...(relations ?? []), "profile"], eh);
    }

    async update<T extends QueryDeepPartialEntity<User>>(id: number, updateDto: T, eh?: EH): Promise<IStatusResponse> {
        return await super.update(id, updateDto, eh);
    }
}
