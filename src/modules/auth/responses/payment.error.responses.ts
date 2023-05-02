const PaymentErrors = {
    PAYMENT_400_EMPTY_AMOUNT: {
        status: 400,
        code: "PAYMENT_400_EMPTY_AMOUNT",
        message: "Payment amount cannot be empty!",
    },
    PAYMENT_400_INVALID_STATUS: {
        status: 400,
        code: "PAYMENT_400_INVALID_STATUS",
        message: "Invalid value for payment status!",
    },
};

export { PaymentErrors };
