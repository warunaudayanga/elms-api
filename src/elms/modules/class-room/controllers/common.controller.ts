import { Controller, Get } from "@nestjs/common";
import { Endpoint, Status } from "../../../../core/enums";
import { Area } from "../entities/area.entity";
import { AreaService } from "../services";

@Controller(Endpoint.COMMON)
export class CommonController {
    constructor(private readonly areaService: AreaService) {}

    @Get("area")
    getAreas(): Promise<Area[]> {
        return this.areaService.getWithoutPage({ filters: { status: Status.ACTIVE } });
    }
}
