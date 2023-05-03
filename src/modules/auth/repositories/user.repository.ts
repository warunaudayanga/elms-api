import { CustomRepository } from "../../typeorm-ex/decorators";
import { BaseRepository, relations } from "src/core/entity";
import { User } from "../entities";
import { IUserRepository } from "../interfaces";

// noinspection JSUnusedGlobalSymbols
export const userRelations = ["area", "tutor", "classRooms", "classStudents", ...relations];

@CustomRepository(User)
export class UserRepository extends BaseRepository<User> implements IUserRepository {}
