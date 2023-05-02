import { Module } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios";
import { CustomHttpService } from "../../../core/services/custom-http.service";
import { RedisCacheModule, TypeOrmExModule } from "../../../modules";
import { ClassStudent } from "../class-room/entities/class-students.entity";
import { Payment } from "../class-room/entities/payment.entity";
import { StripeService } from "./services/stripe.service";
import { StripeController } from "./controllers/stripe.controller";
import { PaymentService } from "../class-room/services";
import { ClassStudentsRepository, PaymentRepository } from "../class-room/repositories";

@Module({
    imports: [
        HttpModule,
        RedisCacheModule,
        TypeOrmExModule.forCustomRepository([Payment, PaymentRepository, ClassStudent, ClassStudentsRepository]),
    ],
    controllers: [StripeController],
    providers: [CustomHttpService, StripeService, PaymentService],
    exports: [StripeService],
})
export class CustomStripeModule {}
