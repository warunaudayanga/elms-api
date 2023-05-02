import { Module } from "@nestjs/common";
import { ZoomController } from "./controllers/zoom.controller";
import { ZoomService } from "./services/zoom.service";
import { HttpModule } from "@nestjs/axios";
import { CustomHttpService } from "../../../core/services/custom-http.service";
import { RedisCacheModule } from "../../../modules";

@Module({
    imports: [HttpModule, RedisCacheModule],
    controllers: [ZoomController],
    providers: [CustomHttpService, ZoomService],
    exports: [ZoomService],
})
export class ZoomModule {}
