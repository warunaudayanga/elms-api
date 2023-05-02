import { Controller, Get } from "@nestjs/common";
import { Endpoint, Status } from "../../../../core/enums";
import { AreaService } from "../services";
import { Area } from "../entities";

@Controller(Endpoint.COMMON)
export class CommonController {
    constructor(private readonly areaService: AreaService) {}

    @Get("area")
    getAreas(): Promise<Area[]> {
        return this.areaService.getWithoutPage({ filters: { status: Status.ACTIVE } });
    }
}
