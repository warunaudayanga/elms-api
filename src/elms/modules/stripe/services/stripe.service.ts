import { Injectable, RawBodyRequest } from "@nestjs/common";
import { CustomHttpService } from "../../../../core/services/custom-http.service";
import { RedisCacheService } from "../../../../modules/cache/services/redis-cache.service";
import { InjectStripe } from "nestjs-stripe";
import { Stripe } from "stripe";
import { CheckoutSessionDto } from "../dtos/checkout-session.dto";
import { PaymentIntentDto } from "../dtos/payment-intent.dto";
import configuration from "../../../../core/config/configuration";
import { Request, Response } from "express";
import { StripeEvents } from "../enums/stripe-events.enum";
import { StripeResponse } from "../interfaces/stripe.interfaces";
import { PaymentService } from "../../class-room/services";
import { ClassStudentsRepository } from "../../class-room/repositories";
import { InjectRepository } from "@nestjs/typeorm";
import { PaymentStatus } from "../../class-room/enums";
import { PaymentType } from "../enums/payment-type.enum";
import { ClassFeeMeta } from "../../class-room/interfaces/class-room.interfaces";

@Injectable()
export class StripeService {
    constructor(
        @InjectStripe() private readonly stripe: Stripe,
        @InjectRepository(ClassStudentsRepository) private readonly classStudentsRepository: ClassStudentsRepository,
        private readonly http: CustomHttpService,
        private readonly cacheService: RedisCacheService,
        private readonly paymentService: PaymentService,
    ) {}

    async createCheckoutSession(checkoutSessionDto: CheckoutSessionDto): Promise<{ id: string }> {
        const session = await this.stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: "lkr",
                        product_data: {
                            name: checkoutSessionDto.className,
                        },
                        unit_amount: checkoutSessionDto.price,
                    },
                    quantity: 1,
                },
            ],
            mode: "payment",
            success_url: "https://example.com/success",
            cancel_url: "https://example.com/cancel",
        });

        return { id: session.id };
    }

    async createPaymentIntent(
        userId: number,
        paymentIntentDto: PaymentIntentDto,
    ): Promise<Stripe.Response<Stripe.PaymentIntent>> {
        // ------------------------------------------------
        const classStudent = await this.classStudentsRepository.findOne({
            where: { studentId: userId, classRoomId: paymentIntentDto.metadata.classRoomId },
        });
        await this.paymentService.save({
            classStudent: { id: classStudent.id },
            amount: paymentIntentDto.metadata.amount / 100,
            currency: "LKR",
            status: PaymentStatus.PAID,
            fromDate: paymentIntentDto.metadata.fromDate,
            toDate: paymentIntentDto.metadata.toDate,
            transactionId: "stripeResponse.id",
            stripeData: {},
        });
        // ------------------------------------------------
        return await this.stripe.paymentIntents.create({
            amount: parseInt(String(paymentIntentDto.amount)),
            currency: "lkr",
            payment_method_types: ["card"],
            metadata: { ...(paymentIntentDto.metadata ?? {}), userId },
        });
    }

    handleWebhook(request: RawBodyRequest<Request>, response: Response): Response {
        const endpointSecret = configuration().stripe.webhookSecret;
        let event: Stripe.TypedEvent<StripeResponse> = request.body;

        if (endpointSecret) {
            const signature = request.headers["stripe-signature"];
            try {
                event = this.stripe.webhooks.constructEvent(
                    request.rawBody,
                    signature,
                    endpointSecret,
                ) as Stripe.TypedEvent;
            } catch (err) {
                return response.sendStatus(400);
            }
        }

        // Handle the event
        switch (event.type as StripeEvents) {
            case StripeEvents.PI_SUCCEEDED:
                const paymentIntent = event.data.object;
                // noinspection JSIgnoredPromiseFromCall
                this.handlePaymentIntentSucceeded(paymentIntent);
                break;
            case StripeEvents.PI_PAYMENT_FAILED:
                const paymentFailedIntent = event.data.object;
                // eslint-disable-next-line no-console
                console.log("Fail: ", paymentFailedIntent);
                break;
            default:
            // eslint-disable-next-line no-console
            // console.log(event.type + ": ", event.data.object);
        }

        response.send();
    }

    async handlePaymentIntentSucceeded(stripeResponse: StripeResponse): Promise<void> {
        // eslint-disable-next-line default-case
        switch (stripeResponse.metadata?.type) {
            case PaymentType.CLASS_FEE:
                await this.handleClassFee(stripeResponse);
                break;
        }
    }

    async handleClassFee(stripeResponse: StripeResponse<ClassFeeMeta>): Promise<void> {
        const studentId = Number(stripeResponse.metadata.userId);
        const classRoomId = Number(stripeResponse.metadata.classRoomId);
        const classStudent = await this.classStudentsRepository.findOne({ where: { studentId, classRoomId } });
        await this.paymentService.save({
            classStudent: { id: classStudent.id },
            amount: stripeResponse.amount / 100,
            currency: stripeResponse.currency,
            status: PaymentStatus.PAID,
            fromDate: stripeResponse.metadata.fromDate,
            toDate: stripeResponse.metadata.toDate,
            transactionId: stripeResponse.id,
            stripeData: stripeResponse,
        });
    }
}
