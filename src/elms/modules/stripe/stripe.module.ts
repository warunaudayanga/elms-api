import { Module } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios";
import { CustomHttpService } from "../../../core/services/custom-http.service";
import { RedisCacheModule, TypeOrmExModule } from "../../../modules";
import { StripeService } from "./services/stripe.service";
import { StripeController } from "./controllers/stripe.controller";
import { PaymentService } from "../class-room/services";
import { ClassStudent, Payment } from "../class-room/entities";
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
