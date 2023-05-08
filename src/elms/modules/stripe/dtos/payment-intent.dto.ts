import { IsNotEmpty } from "class-validator";
import { ClassFeeMeta } from "../interfaces/stripe.interfaces";

export class PaymentIntentDto {
    @IsNotEmpty()
    amount: number;

    @IsNotEmpty()
    metadata: ClassFeeMeta;
}
