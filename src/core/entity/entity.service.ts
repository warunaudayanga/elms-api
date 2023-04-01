import { BaseRepository } from "./entity.repository";
import { FindOneOptions, SaveOptions } from "typeorm";
import { DeepPartial } from "typeorm/common/DeepPartial";
import { EntityUtils } from "./entity.utils";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
import { NotFoundException } from "@nestjs/common";
import {
    IPaginatedResponse,
    IStatusResponse,
    IBaseEntity,
    FindConditions,
    GetMany,
    GetAll,
    GetOne,
} from "./interfaces";
import { Operation } from "./entity.enums";
import { EntityErrors } from "./entity.error.responses";
import { User } from "src/modules/auth/entities/user.entity";
import { SocketService } from "../../modules/socket/services";
import { EH } from "./entity.types";

// noinspection JSUnusedGlobalSymbols
export abstract class EntityService<Entity extends Partial<IBaseEntity>> {
    protected constructor(
        protected readonly socketService: SocketService,
        protected readonly repository: BaseRepository<Entity>,
        protected readonly entityName: string,
        protected readonly uniqueFieldName?: string,
    ) {}

    // abstract map(entity: Entity): Entity;

    async create<T extends DeepPartial<Entity>>(
        createDto: T,
        options?: SaveOptions,
        relations?: string[],
        eh?: EH,
    ): Promise<Entity> {
        try {
            const entity = await this.repository.save(createDto, options);
            return this.get(entity.id, { relations });
        } catch (e: any) {
            if (eh) {
                const err = eh(e);
                if (err) {
                    throw err;
                }
            }
            EntityUtils.handleError(e, this.entityName, this.uniqueFieldName);
        }
    }

    async createMany<T extends DeepPartial<Entity>>(createDto: T[], options?: SaveOptions, eh?: EH): Promise<Entity[]> {
        try {
            return await this.repository.saveMany(createDto, options);
        } catch (e: any) {
            if (eh) {
                const err = eh(e);
                if (e) {
                    throw err;
                }
            }
            EntityUtils.handleError(e, this.entityName, this.uniqueFieldName);
        }
    }

    async update<T extends QueryDeepPartialEntity<Entity>>(
        id: number,
        updateDto: T,
        eh?: EH,
    ): Promise<IStatusResponse> {
        try {
            const { affected } = await this.repository.update(id, updateDto);
            if (affected !== 0) {
                return EntityUtils.handleSuccess(Operation.UPDATE, this.entityName);
            }
            return Promise.reject(new NotFoundException(EntityErrors.E_404_ID(this.entityName)));
        } catch (e: any) {
            if (eh) {
                const err = eh(e);
                if (e) {
                    throw err;
                }
            }
            EntityUtils.handleError(e, this.entityName, this.uniqueFieldName);
        }
    }

    async updateOne<T extends QueryDeepPartialEntity<Entity>>(
        conditions: FindConditions<Entity>,
        updateDto: T,
        eh?: EH,
    ): Promise<IStatusResponse> {
        try {
            const { affected } = await this.repository.updateOne(conditions, updateDto);
            if (affected !== 0) {
                return EntityUtils.handleSuccess(Operation.UPDATE, this.entityName);
            }
            return Promise.reject(new NotFoundException(EntityErrors.E_404_CONDITION(this.entityName)));
        } catch (e: any) {
            if (eh) {
                const err = eh(e);
                if (e) {
                    throw err;
                }
            }
            EntityUtils.handleError(e, this.entityName, this.uniqueFieldName);
        }
    }

    async updateMany<T extends QueryDeepPartialEntity<Entity>>(
        conditions: FindConditions<Entity>,
        updateDto: T,
        eh?: EH,
    ): Promise<IStatusResponse> {
        try {
            const { affected } = await this.repository.updateMany(conditions, updateDto);
            if (affected !== 0) {
                return EntityUtils.handleSuccess(Operation.UPDATE, this.entityName);
            }
        } catch (e: any) {
            if (eh) {
                const err = eh(e);
                if (e) {
                    throw err;
                }
            }
            EntityUtils.handleError(e, this.entityName, this.uniqueFieldName);
        }
    }

    async updateByIds<T extends QueryDeepPartialEntity<Entity>>(
        ids: number[],
        updateDto: T,
        eh?: EH,
    ): Promise<IStatusResponse> {
        try {
            const { affected } = await this.repository.updateByIds(ids, updateDto);
            if (affected !== 0) {
                return EntityUtils.handleSuccess(Operation.UPDATE, this.entityName);
            }
        } catch (e: any) {
            if (eh) {
                const err = eh(e);
                if (e) {
                    throw err;
                }
            }
            EntityUtils.handleError(e, this.entityName, this.uniqueFieldName);
        }
    }

    async get(id: number, options?: FindOneOptions<Entity>, eh?: EH): Promise<Entity> {
        try {
            const entity = await this.repository.get(id, options);
            if (entity) {
                return entity;
            }
            return Promise.reject(new NotFoundException(EntityErrors.E_404_ID(this.entityName)));
        } catch (e: any) {
            if (eh) {
                const err = eh(e);
                if (e) {
                    throw err;
                }
            }
            EntityUtils.handleError(e, this.entityName, this.uniqueFieldName);
        }
    }

    async getOne(getOne: GetOne<Entity>, eh?: EH): Promise<Entity> {
        try {
            const entity = await this.repository.getOne(getOne);
            if (entity) {
                return entity;
            }
            return Promise.reject(new NotFoundException(EntityErrors.E_404_CONDITION(this.entityName)));
        } catch (e: any) {
            if (eh) {
                const err = eh(e);
                if (e) {
                    throw err;
                }
            }
            EntityUtils.handleError(e, this.entityName, this.uniqueFieldName);
        }
    }

    async getMany(getMany: GetMany<Entity>, eh?: EH): Promise<IPaginatedResponse<Entity>> {
        try {
            let [data, rowCount] = await this.repository.getMany(getMany);
            return { data, rowCount };
        } catch (e: any) {
            if (eh) {
                const err = eh(e);
                if (e) {
                    throw err;
                }
            }
            EntityUtils.handleError(e, this.entityName, this.uniqueFieldName);
        }
    }

    async getWithoutPage(getMany: Omit<GetMany<Entity>, "pagination">, eh?: EH): Promise<Entity[]> {
        try {
            getMany.options.skip = undefined;
            getMany.options.take = undefined;
            let [data] = await this.repository.getMany({ ...getMany });
            return data;
        } catch (e: any) {
            if (eh) {
                const err = eh(e);
                if (e) {
                    throw err;
                }
            }
            EntityUtils.handleError(e, this.entityName, this.uniqueFieldName);
        }
    }

    async getAll(getAll: GetAll<Entity>, eh?: EH): Promise<IPaginatedResponse<Entity>> {
        const { relations, pagination, sort, options } = getAll;
        try {
            const getMany: GetMany<Entity> = { where: {}, relations, pagination, sort, options };
            let [data, rowCount] = await this.repository.getMany(getMany);
            return { data, rowCount };
        } catch (e: any) {
            if (eh) {
                const err = eh(e);
                if (e) {
                    throw err;
                }
            }
            EntityUtils.handleError(e, this.entityName, this.uniqueFieldName);
        }
    }

    async delete(id: number, deletedBy: User, wipe?: boolean, eh?: EH): Promise<IStatusResponse> {
        try {
            const { affected } = wipe ? await this.repository.hardDelete(id) : await this.repository.delete(id);
            if (affected !== 0) {
                if (!wipe && deletedBy) {
                    try {
                        await this.update(id, { deletedBy } as any);
                    } catch (err: any) {}
                }
                return EntityUtils.handleSuccess(Operation.DELETE, this.entityName);
            }
            return Promise.reject(new NotFoundException(EntityErrors.E_404_ID(this.entityName)));
        } catch (e: any) {
            if (eh) {
                const err = eh(e);
                if (e) {
                    throw err;
                }
            }
            EntityUtils.handleError(e, this.entityName, this.uniqueFieldName);
        }
    }

    async deleteByIds(ids: number[], deletedBy?: User, wipe?: boolean, eh?: EH): Promise<IStatusResponse> {
        try {
            const { affected } = wipe
                ? await this.repository.hardDeleteByIds(ids)
                : await this.repository.deleteByIds(ids);
            if (affected !== 0) {
                if (!wipe && deletedBy) {
                    await this.updateByIds(ids, { deletedBy } as any);
                }
                return EntityUtils.handleSuccess(Operation.DELETE, this.entityName);
            }
            return Promise.reject(new NotFoundException(EntityErrors.E_404_ID(this.entityName)));
        } catch (e: any) {
            if (eh) {
                const err = eh(e);
                if (e) {
                    throw err;
                }
            }
            EntityUtils.handleError(e, this.entityName, this.uniqueFieldName);
        }
    }
}
