import { CustomRepository } from "../../../../modules/typeorm-ex/decorators";
import { BaseRepository } from "../../../../core/entity";
import { Tutor } from "../entities/tutor.entity";
import { ITutorRepository } from "../interfaces/repositories";

@CustomRepository(Tutor)
export class TutorRepository extends BaseRepository<Tutor> implements ITutorRepository {}
