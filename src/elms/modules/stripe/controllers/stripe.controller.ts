/* eslint-disable no-console */
import { Body, Controller, Post, Req, Res, UseGuards } from "@nestjs/common";
import { Endpoint } from "../../../../core/enums";
import { JwtAuthGuard } from "../../../../modules/auth/guards";
import { RoleGuard } from "../../../../core/guards/role.guard";
import { StripeService } from "../services/stripe.service";
import { CheckoutSessionDto } from "../dtos/checkout-session.dto";
import { PaymentIntentDto } from "../dtos/payment-intent.dto";
import { Stripe } from "stripe";
import { Request, Response } from "express";
import { ReqUser } from "../../../../core/decorators";
import { User } from "../../../../modules/auth/entities";

@Controller(Endpoint.STRIPE)
export class StripeController {
    constructor(private stripeService: StripeService) {}

    @Post("webhook")
    webhook(@Req() req: Request, @Res() res: Response): void {
        this.stripeService.handleWebhook(req, res);
    }

    @UseGuards(JwtAuthGuard, RoleGuard)
    @Post("create-checkout-session")
    createCheckoutSession(@Body() checkoutSessionDto: CheckoutSessionDto): Promise<{ id: string }> {
        return this.stripeService.createCheckoutSession(checkoutSessionDto);
    }

    @UseGuards(JwtAuthGuard, RoleGuard)
    @Post("create-payment-intent")
    createPaymentIntent(
        @ReqUser() user: User,
        @Body() paymentIntentDto: PaymentIntentDto,
    ): Promise<Stripe.Response<Stripe.PaymentIntent>> {
        return this.stripeService.createPaymentIntent(user.id, paymentIntentDto);
    }
}
