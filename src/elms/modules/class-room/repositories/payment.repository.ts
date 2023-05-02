import { CustomRepository } from "../../../../modules/typeorm-ex/decorators";
import { BaseRepository } from "../../../../core/entity";
import { Payment } from "../entities";
import { IPaymentRepository } from "../interfaces/repositories";

@CustomRepository(Payment)
export class PaymentRepository extends BaseRepository<Payment> implements IPaymentRepository {}
