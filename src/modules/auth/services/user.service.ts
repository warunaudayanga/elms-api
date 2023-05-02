import { Injectable } from "@nestjs/common";
import { EntityService, IPaginatedResponse, IPagination, ISort } from "../../../core/entity";
import { User } from "../entities";
import { InjectRepository } from "@nestjs/typeorm";
import { userRelations, UserRepository } from "../repositories";
import { SocketService } from "../../socket/services";
import { DeepPartial } from "typeorm/common/DeepPartial";
import { EntityManager, FindOneOptions, SaveOptions } from "typeorm";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
import { EH } from "../../../core/entity/entity.types";
import { Role } from "../enums";
import { AuthService } from "./auth.service";
import { UpdateUserDto } from "../dtos";
import { FilterUserDto } from "../../../elms/modules/class-room/dtos";

@Injectable()
export class UserService extends EntityService<User> {
    constructor(
        @InjectRepository(UserRepository) private readonly userRepository: UserRepository,
        protected readonly socketService: SocketService,
    ) {
        super(socketService, userRepository, "user", "username");
    }

    async save<T extends DeepPartial<User>>(
        createDto: T,
        options?: SaveOptions & FindOneOptions<User>,
        manager?: EntityManager,
        eh?: EH,
    ): Promise<User> {
        return await super.save(createDto, options, manager, eh);
    }

    async update<T extends QueryDeepPartialEntity<User>>(
        id: number,
        updateDto: T,
        options?: FindOneOptions<User>,
        manager?: EntityManager,
        eh?: EH,
    ): Promise<User> {
        return await super.update(id, updateDto, options, manager, eh);
    }

    async getAllUsers(
        filters: FilterUserDto,
        keyword: string,
        pagination: IPagination,
        sort: ISort<User>,
    ): Promise<IPaginatedResponse<User> | User[]> {
        const search = {} as any;
        if (keyword) {
            const criteria: string[] = keyword.split(" ");
            search.firstName = criteria[0]?.trim();
            search.lastName = criteria[1] ? criteria[1]?.trim() : criteria[0]?.trim();
        }
        const not = filters.role && filters.role !== Role.SUPER_ADMIN ? {} : { role: Role.SUPER_ADMIN };
        return await this.getMany({
            filters,
            search,
            not,
            pagination,
            sort,
            relations: userRelations,
        });
    }

    async updateUser(id: number, updateUserDto: UpdateUserDto, updatedBy: User): Promise<User> {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { status, role, ...rest } = updateUserDto as User;
        if (rest.password) {
            const authData = AuthService.generatePassword(rest.password);
            rest.password = authData.password;
            rest.salt = authData.salt;
        }
        return await this.update(id, { ...rest, updatedBy });
    }
}
