import { CustomRepository } from "../../../../modules/typeorm-ex/decorators";
import { BaseRepository } from "../../../../core/entity";
import { ClassPayment } from "../entities/class-payment.entity";
import { IClassPaymentRepository } from "../interfaces/repositories/class-payment.repository.interface";

@CustomRepository(ClassPayment)
export class ClassPaymentRepository extends BaseRepository<ClassPayment> implements IClassPaymentRepository {}
