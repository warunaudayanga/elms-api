import { CustomRepository } from "../../../../modules/typeorm-ex/decorators";
import { BaseRepository } from "src/core/entity";
import { Area } from "../entities";
import { IAreaRepository } from "../interfaces/repositories";

@CustomRepository(Area)
export class AreaRepository extends BaseRepository<Area> implements IAreaRepository {}
