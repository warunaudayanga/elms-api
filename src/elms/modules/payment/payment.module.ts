import { Global, Module } from "@nestjs/common";
import { TypeOrmExModule } from "../../../modules";
import { Payment } from "./entities/payment.entity";
import { PaymentRepository } from "../class-room/repositories";
import { PaymentController } from "./controllers/payment.controller";
import { PaymentService } from "./services/payment.service";
import { ClassPayment } from "../class-room/entities/class-payment.entity";
import { ClassPaymentRepository } from "../class-room/repositories/class-payment.repository";

@Global()
@Module({
    imports: [TypeOrmExModule.forCustomRepository([Payment, PaymentRepository, ClassPayment, ClassPaymentRepository])],
    controllers: [PaymentController],
    providers: [PaymentService],
    exports: [PaymentService],
})
export class PaymentModule {}
