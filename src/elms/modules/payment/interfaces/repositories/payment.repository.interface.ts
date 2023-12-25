import { IEntityRepository } from "../../../../../core/entity/interfaces/entity.repository.interface";
import { Payment } from "../../entities/payment.entity";

export interface IPaymentRepository extends IEntityRepository<Payment> {}
