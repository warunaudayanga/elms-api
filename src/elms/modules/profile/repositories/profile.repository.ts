import { CustomRepository } from "../../../../modules/typeorm-ex/decorators";
import { Profile } from "../entities/profile.entity";
import { IProfileRepository } from "../interfaces/repositories/profile.repository.interface";
import { BaseRepository } from "../../../../core/entity";

@CustomRepository(Profile)
export class ProfileRepository extends BaseRepository<Profile> implements IProfileRepository {}
