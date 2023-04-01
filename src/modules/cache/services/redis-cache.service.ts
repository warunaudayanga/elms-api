import { CACHE_MANAGER, Inject, Injectable } from "@nestjs/common";
import { Cache } from "cache-manager";
import { User } from "../../auth/entities/user.entity";
import configuration from "../../../core/config/configuration";

const USER_PREFIX = `${configuration().redis.prefix}-user`;

@Injectable()
export class RedisCacheService {
    constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}

    private async get<T = unknown>(key: string): Promise<T | undefined> {
        return await this.cache.get<T>(key);
    }

    private async set<T = unknown>(key: string, value: T): Promise<void> {
        return await this.cache.set(key, value);
    }

    private async delete(key: string): Promise<void> {
        return await this.cache.del(key);
    }

    async setUser(user: User): Promise<void> {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, salt, ...rest } = user;
        const key = `${USER_PREFIX}-${user.id}`;
        await this.set<User>(key, rest);
    }

    // noinspection JSUnusedGlobalSymbols
    async getUser(id: number): Promise<Omit<User, "password" | "salt">> {
        const key = `${USER_PREFIX}-${id}`;
        return await this.get<User>(key);
    }

    async clearUser(id: number): Promise<void> {
        const key = `${USER_PREFIX}-${id}`;
        return await this.delete(key);
    }
}
