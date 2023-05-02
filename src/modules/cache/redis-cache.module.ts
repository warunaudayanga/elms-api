import { CacheModule, Global, Module } from "@nestjs/common";
import * as redisStore from "cache-manager-redis-store";
import configuration from "../../core/config/configuration";
import { RedisCacheService } from "./services/redis-cache.service";

@Global()
@Module({
    imports: [
        CacheModule.registerAsync({
            useFactory: () => ({
                store: redisStore,
                host: configuration().redis.host,
                port: configuration().redis.port,
                ttl: configuration().redis.ttl,
                password: configuration().redis.password,
            }),
        }),
    ],
    providers: [RedisCacheService],
    exports: [RedisCacheService],
})
export class RedisCacheModule {}
