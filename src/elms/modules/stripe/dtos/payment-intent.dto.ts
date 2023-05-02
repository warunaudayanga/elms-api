import { IsNotEmpty } from "class-validator";

export class PaymentIntentDto {
    @IsNotEmpty()
    amount: number;

    @IsNotEmpty()
    metadata: object;
}
