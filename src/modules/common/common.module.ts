import { Global, Module } from "@nestjs/common";
import { CommonController } from "./common.controller";
import { LoggerService } from "src/core/services";
import { HttpModule } from "@nestjs/axios";
import { EmailService } from "./services";

@Global()
@Module({
    imports: [HttpModule],
    controllers: [CommonController],
    providers: [LoggerService, EmailService],
    exports: [LoggerService, EmailService],
})
export class CommonModule {}
