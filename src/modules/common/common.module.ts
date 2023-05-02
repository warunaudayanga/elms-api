import { Global, Module } from "@nestjs/common";
import { CommonController } from "./common.controller";
import { LoggerService } from "src/core/services";
import { HttpModule } from "@nestjs/axios";

@Global()
@Module({
    imports: [HttpModule],
    controllers: [CommonController],
    providers: [LoggerService],
    exports: [LoggerService],
})
export class CommonModule {}
