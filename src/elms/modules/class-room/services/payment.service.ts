import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityService } from "src/core/entity";
import { SocketService } from "src/modules/socket/services/socket.service";
import { Payment } from "../entities/payment.entity";
import { PaymentRepository } from "../repositories";

@Injectable()
export class PaymentService extends EntityService<Payment> {
    constructor(
        @InjectRepository(PaymentRepository) private readonly paymentRepository: PaymentRepository,
        protected readonly socketService: SocketService,
    ) {
        super(socketService, paymentRepository, "payment");
    }
}
