import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MD5 } from "crypto-js";
import { EntityService } from "src/core/entity";
import { SocketService } from "src/modules/socket/services/socket.service";
import { Payment } from "../entities/payment.entity";
import { PaymentRepository } from "../../class-room/repositories";
import { GenerateHashDto } from "../dtos/generate-hash.dto";
import configuration from "../../../../core/config/configuration";
import { PaymentNotifyDto } from "../dtos/payment-notify.dto";
import { validateDto } from "../../../../core/utils/common.utils";
import { ClassFeeMeta, PaymentMeta } from "../types/payment.types";
import { PaymentType } from "../enums/payment-type.enum";
import { PayHerePaymentStatus } from "../enums/payhere-payment-status.enum";
import { AppEvent } from "../../../../core/enums/app-event.enum";
import { PaymentStatus } from "../enums/payment-status.enum";
import { ClassPaymentRepository } from "../../class-room/repositories/class-payment.repository";
import { Status } from "../../../../core/enums";

@Injectable()
export class PaymentService extends EntityService<Payment> {
    constructor(
        @InjectRepository(PaymentRepository) private readonly paymentRepository: PaymentRepository,
        @InjectRepository(ClassPaymentRepository) private readonly classPaymentRepository: ClassPaymentRepository,
        protected readonly socketService: SocketService,
    ) {
        super(socketService, paymentRepository, "payment");
    }

    generateHash(generateHashDto: GenerateHashDto, statusCode?: PayHerePaymentStatus): string {
        const { orderId, amount, currency } = generateHashDto;
        const merchantId = configuration().payhere.merchantId;
        const secret = configuration().payhere.secret;
        const hashedSecret = MD5(secret).toString().toUpperCase();
        const hashedInput = `${merchantId}${orderId}${amount}${currency}${statusCode ? statusCode : ""}${hashedSecret}`;
        return MD5(hashedInput).toString().toUpperCase();
    }

    async notify(body: unknown): Promise<void> {
        try {
            const paymentNotifyDto: PaymentNotifyDto = await validateDto(PaymentNotifyDto, body);
            if (!this.verifyPayment(paymentNotifyDto)) {
                console.log("Invalid Signature");
                return;
            }
            if (
                paymentNotifyDto.status_code === PayHerePaymentStatus.SUCCESS ||
                paymentNotifyDto.status_code === PayHerePaymentStatus.PENDING
            ) {
                await this.savePayment(paymentNotifyDto);
            }
        } catch (e) {
            console.log(e);
            console.log("Invalid Request");
        }
    }

    verifyPayment(paymentNotifyDto: PaymentNotifyDto): boolean {
        const hash = this.generateHash(
            {
                orderId: paymentNotifyDto.order_id,
                amount: paymentNotifyDto.payhere_amount,
                currency: paymentNotifyDto.payhere_currency,
            },
            paymentNotifyDto.status_code,
        );
        return hash === paymentNotifyDto.md5sig;
    }

    async savePayment(notifyDto: PaymentNotifyDto): Promise<void> {
        const paymentMeta: PaymentMeta = JSON.parse(notifyDto.custom_1);

        let payment: Payment = await this.paymentRepository.findOneBy({ transactionId: notifyDto.order_id });
        if (!payment) {
            payment = await this.paymentRepository.save({
                amount: paymentMeta.amount,
                currency: paymentMeta.currency,
                transactionId: paymentMeta.orderId,
                fromDate: paymentMeta.fromDate,
                toDate: paymentMeta.fromDate,
                status:
                    notifyDto.status_code === PayHerePaymentStatus.SUCCESS
                        ? PaymentStatus.PAID
                        : PayHerePaymentStatus.PENDING
                        ? PaymentStatus.PENDING
                        : PayHerePaymentStatus.FAILED
                        ? PaymentStatus.FAILED
                        : PaymentStatus.CANCELED,
                paymentResponse: notifyDto,
            });
        } else if (payment.status === PaymentStatus.PENDING && notifyDto.status_code === PayHerePaymentStatus.SUCCESS) {
            payment = await this.paymentRepository.updateAndGet(payment.id, {
                status: PaymentStatus.PAID,
                paymentResponse: notifyDto,
            });
        }

        switch (paymentMeta.type) {
            case PaymentType.CLASS_FEE:
                await this.saveClassFeePayment(payment, paymentMeta);
                break;
            default:
                throw new Error("Invalid Payment Type");
        }

        this.socketService.sendMessage(
            AppEvent.PAYMENT_OCCURRED,
            {
                meta: paymentMeta,
                status: payment.status,
            },
            [paymentMeta.studentId],
        );
    }

    async saveClassFeePayment(payment: Payment, classFeeMeta: ClassFeeMeta): Promise<void> {
        await this.classPaymentRepository.save({
            classRoom: { id: classFeeMeta.classRoomId },
            classStudent: { id: classFeeMeta.classStudentId },
            payment: { id: payment.id },
            status: Status.ACTIVE,
        });
    }
}
