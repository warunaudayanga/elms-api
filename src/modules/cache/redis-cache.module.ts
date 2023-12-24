import { CacheModule, Global, Module } from "@nestjs/common";
import * as redisStore from "cache-manager-redis-store";
import configuration from "../../core/config/configuration";
import { RedisCacheService } from "./services/redis-cache.service";
import { CacheModuleOptions } from "@nestjs/common/cache/interfaces/cache-module.interface";

@Global()
@Module({
    imports: [
        CacheModule.registerAsync({
            useFactory: () =>
                configuration().redis.url
                    ? {
                          store: redisStore,
                          ttl: configuration().redis.ttl,
                          url: configuration().redis.url,
                      }
                    : ({
                          store: redisStore,
                          ttl: configuration().redis.ttl,
                          host: configuration().redis.host,
                          port: configuration().redis.port,
                          password: configuration().redis.password,
                      } as CacheModuleOptions),
        }),
    ],
    providers: [RedisCacheService],
    exports: [RedisCacheService],
})
export class RedisCacheModule {}
