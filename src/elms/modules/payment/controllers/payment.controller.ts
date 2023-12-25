import { Body, Controller, Post, Res, UseGuards } from "@nestjs/common";
import { Endpoint } from "src/core/enums";
import { JwtAuthGuard } from "src/core/guards";
import { PaymentService } from "../services/payment.service";
import { GenerateHashDto } from "../dtos/generate-hash.dto";
import { IHashResponse } from "../interfaces/payhere.interfaces";
import { Response } from "express";

@Controller(Endpoint.PAYMENT)
export class PaymentController {
    constructor(private readonly paymentService: PaymentService) {}

    @Post("notify")
    async notify(@Body() body: unknown, @Res() response: Response): Promise<any> {
        // noinspection ES6MissingAwait
        this.paymentService.notify(body);
        response.status(200).send("OK");
    }

    @UseGuards(JwtAuthGuard)
    @Post("generate-hash")
    generateHash(@Body() generateHashDto: GenerateHashDto): IHashResponse {
        const hash = this.paymentService.generateHash(generateHashDto);
        return { hash };
    }
}
