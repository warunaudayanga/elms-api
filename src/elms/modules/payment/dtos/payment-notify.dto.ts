import { IsEnum, IsJSON, IsNotEmpty, IsString } from "class-validator";
import { PayHerePaymentStatus } from "../enums/payhere-payment-status.enum";

export class PaymentNotifyDto {
    @IsString()
    @IsNotEmpty()
    merchant_id: string;

    @IsString()
    @IsNotEmpty()
    order_id: string;

    @IsString()
    @IsNotEmpty()
    payment_id: string;

    @IsString()
    @IsNotEmpty()
    captured_amount: string;

    @IsString()
    @IsNotEmpty()
    payhere_amount: string;

    @IsString()
    @IsNotEmpty()
    payhere_currency: string;

    @IsEnum(PayHerePaymentStatus)
    @IsNotEmpty()
    status_code: PayHerePaymentStatus;

    @IsString()
    @IsNotEmpty()
    md5sig: string;

    @IsString()
    @IsJSON()
    @IsNotEmpty()
    custom_1: string;

    @IsString()
    @IsNotEmpty()
    status_message: string;

    @IsString()
    @IsNotEmpty()
    method: string;

    @IsString()
    @IsNotEmpty()
    card_holder_name: string;

    @IsString()
    @IsNotEmpty()
    card_no: string;

    @IsString()
    @IsNotEmpty()
    card_expiry: string;

    @IsString()
    @IsNotEmpty()
    recurring: string;
}
