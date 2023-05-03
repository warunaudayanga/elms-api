import { CACHE_MANAGER, Inject, Injectable } from "@nestjs/common";
import { Cache } from "cache-manager";
import { User } from "../../auth/entities";
import configuration from "../../../core/config/configuration";

const GLOBAL_PREFIX = `${configuration().redis.prefix}-user`;
const USER_PREFIX = (userId: number): string => `${configuration().redis.prefix}-${userId}`;

@Injectable()
export class RedisCacheService {
    constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}

    async get<T = unknown>(key: string): Promise<T | null> {
        return await this.cache.get<T>(key);
    }

    async set<T = unknown>(key: string, value: T): Promise<void> {
        return await this.cache.set(key, value);
    }

    async getUserData<T = unknown>(userId: number, key: string): Promise<T | null> {
        return await this.cache.get<T>(`${USER_PREFIX(userId)}-${key}`);
    }

    async setUserData<T = unknown>(userId: number, key: string, value: T): Promise<void> {
        return await this.cache.set(`${USER_PREFIX(userId)}-${key}`, value);
    }

    async delete(key: string): Promise<void> {
        return await this.cache.del(key);
    }

    async setUser(user: User): Promise<void> {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, salt, ...rest } = user;
        const key = USER_PREFIX(user.id);
        await this.set<User>(key, rest);
    }

    // noinspection JSUnusedGlobalSymbols
    async getUser(id: number): Promise<Omit<User, "password" | "salt">> {
        const key = `${GLOBAL_PREFIX}-${id}`;
        return await this.get<User>(key);
    }

    async clearUser(id: number): Promise<void> {
        const key = `${GLOBAL_PREFIX}-${id}`;
        return await this.delete(key);
    }
}
