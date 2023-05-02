import { IsNotEmpty } from "class-validator";

export class CheckoutSessionDto {
    @IsNotEmpty()
    className: string;

    @IsNotEmpty()
    price: number;
}
