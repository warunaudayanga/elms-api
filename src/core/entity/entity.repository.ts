// noinspection JSUnusedGlobalSymbols

import {
    DeleteResult,
    FindManyOptions,
    FindOneOptions,
    FindOperator,
    ILike,
    In,
    Not,
    ObjectLiteral,
    Repository,
    SaveOptions,
} from "typeorm";
import { DeepPartial } from "typeorm/common/DeepPartial";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
import { UpdateResult } from "typeorm/query-builder/result/UpdateResult";
import { FindConditions, GetByIds, GetMany, GetOne, IBaseEntity } from "./interfaces";
import { IEntityRepository } from "./interfaces/entity.repository.interface";

export class BaseRepository<Entity extends Partial<IBaseEntity> & ObjectLiteral>
    extends Repository<Entity>
    implements IEntityRepository<Entity> { // eslint-disable-line prettier/prettier

    save<T extends DeepPartial<Entity>>(entity: T, options?: SaveOptions): Promise<T & Entity> {
        return super.save(entity, options);
    }

    saveMany<T extends DeepPartial<Entity>>(entities: T[], options?: SaveOptions): Promise<(T & Entity)[]> {
        return super.save(entities, options);
    }

    update(id: number, partialEntity: QueryDeepPartialEntity<Entity>): Promise<UpdateResult> {
        return super.update(id, partialEntity);
    }

    updateOne(
        conditions: FindConditions<Entity>,
        partialEntity: QueryDeepPartialEntity<Entity>,
    ): Promise<UpdateResult> {
        return super.update(conditions, partialEntity);
    }

    updateMany(
        findConditions: FindConditions<Entity>,
        partialEntity: QueryDeepPartialEntity<Entity>,
    ): Promise<UpdateResult> {
        return super.update(findConditions, partialEntity);
    }

    updateByIds(ids: number[], partialEntity: QueryDeepPartialEntity<Entity>): Promise<UpdateResult> {
        return this.updateMany({ id: In(ids) as any }, partialEntity);
    }

    get(id: number, options: FindOneOptions<Entity>): Promise<Entity | undefined> {
        return this.getOne({ ...options, where: { id } } as any);
    }

    getOne(getOne: GetOne<Entity>): Promise<Entity | undefined> {
        const { where, not, search, relations, options } = getOne;
        let opt = options ?? {};
        opt.where = where ?? {};
        if (not) {
            opt.where = this.mapWhere(opt.where, not, Not);
        }
        if (search) {
            opt.where = this.mapWhere(opt.where, search, ILike, "%{}%");
        }
        if (relations) {
            opt.relations = relations;
        }
        return super.findOne(opt);
    }

    getByIds(getById: GetByIds<Entity>): Promise<[Entity[], number]> {
        const { ids, relations, pagination, sort, options } = getById;
        let opt = options ?? {};
        if (relations) {
            opt.relations = relations;
        }
        if (pagination) {
            opt.take = pagination.take;
            opt.skip = pagination.skip;
        }
        if (sort) {
            opt.order = sort;
        }
        opt.where = { id: In(ids) as any };
        return this.getMany(opt);
    }

    getMany(getMany: GetMany<Entity>): Promise<[Entity[], number]> {
        const { where, not, search, relations, pagination, sort, options } = getMany;
        let opt = options ?? {};
        opt.where = where ?? {};
        if (not) {
            opt.where = this.mapWhere(opt.where, not, Not);
        }
        if (search) {
            opt.where = this.mapWhere(opt.where, search, ILike, "%{}%");
        }
        if (relations) {
            opt.relations = relations;
        }
        if (pagination) {
            opt.take = pagination.take;
            opt.skip = pagination.skip;
        }
        if (sort) {
            opt.order = sort;
        }
        return super.findAndCount(opt);
    }

    delete(id: number): Promise<DeleteResult> {
        return super.softDelete(id);
    }

    deleteByIds(ids: number[]): Promise<DeleteResult> {
        return super.softDelete(ids);
    }

    hardDelete(id: number): Promise<DeleteResult> {
        return super.delete(id);
    }

    hardDeleteByIds(ids: number[]): Promise<DeleteResult> {
        return super.delete(ids);
    }

    mapWhere(
        where: FindManyOptions<Entity>["where"],
        data: any,
        operator: <T>(value: FindOperator<T> | T) => FindOperator<T>,
        wrap?: `${string}{}${string}`,
    ): any {
        let whr = where ?? {};
        if (typeof data === "object") {
            for (const key in data) {
                if (typeof data[key] === "object") {
                    whr[key] = this.mapWhere(whr[key], data[key], operator, wrap);
                } else {
                    whr[key] = wrap ? operator(wrap.replace("{}", data[key])) : operator(data[key]);
                }
            }
            return whr;
        }
        return wrap ? operator(data) : operator(data);
    }
}
