import { IEntityRepository } from "../../../../core/entity/interfaces/entity.repository.interface";
import { Role } from "../../entities/role.entity";

export interface IRoleRepository extends IEntityRepository<Role> {}
