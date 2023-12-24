import { CACHE_MANAGER, CacheStore, Inject, Injectable } from "@nestjs/common";
import { User } from "../../auth/entities";
import configuration from "../../../core/config/configuration";

const PREFIX = "hc-cache";
const USER_PREFIX = (userId: number): string => `user-${userId}`;

@Injectable()
export class RedisCacheService {
    private readonly prefix: string;

    constructor(@Inject(CACHE_MANAGER) private readonly cache: CacheStore) {
        this.prefix = configuration().redis.prefix ? "" : PREFIX;
    }

    async get<T = unknown>(key: string): Promise<T | undefined> {
        return this.cache.get<T>(`${this.prefix}-${key}`);
    }

    async set<T = unknown>(key: string, value: T): Promise<void> {
        return this.cache.set(`${this.prefix}-${key}`, value);
    }

    async delete(key: string): Promise<void> {
        return this.cache.del(key);
    }

    async getUserData<T = unknown>(userId: number, key: string): Promise<T | null> {
        return this.cache.get<T>(`${USER_PREFIX(userId)}-${key}`);
    }

    async setUserData<T = unknown>(userId: number, key: string, value: T): Promise<void> {
        return this.cache.set(`${USER_PREFIX(userId)}-${key}`, value);
    }

    async setUser(user: User): Promise<void> {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, salt, ...rest } = user;
        await this.set<User>(`${this.prefix}-${user.id}`, rest);
    }

    // noinspection JSUnusedGlobalSymbols
    async getUser(id: number): Promise<Omit<User, "password" | "salt">> {
        const key = `${this.prefix}-${id}`;
        return await this.get<User>(key);
    }

    async clearUser(id: number): Promise<void> {
        const key = `${this.prefix}-${id}`;
        return await this.delete(key);
    }
}
