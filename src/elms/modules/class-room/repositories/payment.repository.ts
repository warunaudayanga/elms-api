import { CustomRepository } from "../../../../modules/typeorm-ex/decorators";
import { BaseRepository } from "../../../../core/entity";
import { Payment } from "../../payment/entities/payment.entity";
import { IPaymentRepository } from "../interfaces/repositories";

@CustomRepository(Payment)
export class PaymentRepository extends BaseRepository<Payment> implements IPaymentRepository {}
