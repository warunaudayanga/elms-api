import { CustomRepository } from "../../typeorm-ex/decorators";
import { BaseRepository } from "src/core/entity";
import { Role } from "../entities/role.entity";
import { IRoleRepository } from "../interfaces";

@CustomRepository(Role)
export class RoleRepository extends BaseRepository<Role> implements IRoleRepository {}
