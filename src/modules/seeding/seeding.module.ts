import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { SeedingMiddleware } from "./seeding.middleware";

@Module({})
export class SeedingModule implements NestModule {
    configure(consumer: MiddlewareConsumer): any {
        consumer.apply(SeedingMiddleware).forRoutes("*");
    }
}
