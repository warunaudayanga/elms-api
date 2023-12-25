import { IsNotEmpty, IsString } from "class-validator";

export class GenerateHashDto {
    @IsString()
    @IsNotEmpty()
    orderId: string;

    @IsString()
    @IsNotEmpty()
    amount: string;

    @IsString()
    @IsNotEmpty()
    currency: string;
}
