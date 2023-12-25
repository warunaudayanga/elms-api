import { PaymentType } from "../enums/payment-type.enum";

export type PaymentMeta<Meta = any> = Meta & {
    type: PaymentType;
    amount: string;
    studentId: number;
    currency?: string;
    orderId?: string;
};

export type ClassFeeMeta = PaymentMeta<{
    type: PaymentType.CLASS_FEE;
    classRoomId: number;
    classStudentId: number;
    fromDate: string;
    toDate: string;
}>;
