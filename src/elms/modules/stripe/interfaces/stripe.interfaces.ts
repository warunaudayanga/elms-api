import { PaymentMetadata } from "../types/stripe.types";

export interface StripePayment<T = any> {
    amount: number;
    metadata: PaymentMetadata<T>;
}

export interface StripeResponse<T = any> {
    id: string;
    amount: number;
    amount_received: number;
    currency: "lkr";
    latest_charge?: string;
    payment_method?: string;
    metadata: PaymentMetadata<T>;
    last_payment_error?: {
        charge: string;
        code: string;
        decline_code: string;
        doc_url: string;
        message: string;
        payment_method: {
            id: string;
            object: string;
            billing_details: object;
            card: object;
            created: number;
            customer: object;
            livemode: false;
            metadata: object;
            type: string;
        };
        type: string;
    };
    status: "succeeded" | "requires_payment_method" | string;
}
