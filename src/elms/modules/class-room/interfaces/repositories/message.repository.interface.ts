import { IEntityRepository } from "../../../../../core/entity/interfaces/entity.repository.interface";
import { Message } from "../../entities";

export interface IMessageRepository extends IEntityRepository<Message> {}
