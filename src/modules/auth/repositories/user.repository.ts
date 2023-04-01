import { CustomRepository } from "../../typeorm-ex/decorators";
import { BaseRepository } from "src/core/entity";
import { User } from "../entities/user.entity";
import { IUserRepository } from "../interfaces";

@CustomRepository(User)
export class UserRepository extends BaseRepository<User> implements IUserRepository {}
