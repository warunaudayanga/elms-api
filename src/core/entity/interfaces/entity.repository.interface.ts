import { DeepPartial } from "typeorm/common/DeepPartial";
import { DeleteResult, FindOneOptions, SaveOptions } from "typeorm";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
import { UpdateResult } from "typeorm/query-builder/result/UpdateResult";
import { FindConditions, GetByIds, GetMany, GetOne } from "./entity.interfaces";

export interface IEntityRepository<Entity> {
    save<T extends DeepPartial<Entity>>(entity: T, options?: SaveOptions): Promise<T & Entity>;

    saveMany<T extends DeepPartial<Entity>>(entities: T[], options?: SaveOptions): Promise<(T & Entity)[]>;

    update(id: number, partialEntity: QueryDeepPartialEntity<Entity>): Promise<UpdateResult>;

    updateOne(conditions: FindConditions<Entity>, partialEntity: QueryDeepPartialEntity<Entity>): Promise<UpdateResult>;

    updateMany(
        findConditions: FindConditions<Entity>,
        partialEntity: QueryDeepPartialEntity<Entity>,
    ): Promise<UpdateResult>;

    updateByIds(ids: number[], partialEntity: QueryDeepPartialEntity<Entity>): Promise<UpdateResult>;

    get(id: number, options: FindOneOptions): Promise<Entity | undefined>;

    getOne(getOne: GetOne<Entity>): Promise<Entity | undefined>;

    getByIds(getByIds: GetByIds<Entity>): Promise<[Entity[], number]>;

    getMany(getMany: GetMany<Entity>): Promise<[Entity[], number]>;

    delete(id: number): Promise<DeleteResult>;

    deleteByIds(ids: number[]): Promise<DeleteResult>;

    hardDelete(id: number): Promise<DeleteResult>;

    hardDeleteByIds(ids: number[]): Promise<DeleteResult>;
}
