// noinspection JSUnusedGlobalSymbols

export enum StripeEvents {
    CH_SESSION_ASYNC_PAYMENT_FAILED = "checkout.session.async_payment_failed",
    CH_SESSION_ASYNC_PAYMENT_SUCCEEDED = "checkout.session.async_payment_succeeded",
    CH_SESSION_COMPLETED = "checkout.session.completed",
    CH_SESSION_EXPIRED = "checkout.session.expired",
    PI_SUCCEEDED = "payment_intent.succeeded",
    PI_REQUIRES_ACTION = "payment_intent.requires_action",
    PI_PROCESSING = "payment_intent.processing",
    PI_PAYMENT_FAILED = "payment_intent.payment_failed",
    PI_PARTIALLY_FUNDED = "payment_intent.partially_funded",
    PI_CREATED = "payment_intent.created",
    PI_CANCELED = "payment_intent.canceled",
    PI_AMOUNT_CAPTURABLE_UPDATED = "payment_intent.amount_capturable_updated",
    PI_ATTACHED = "payment_method.attached",
    PI_AUTOMATICALLY_UPDATED = "payment_method.automatically_updated",
    PI_CARD_AUTOMATICALLY_UPDATED = "payment_method.card_automatically_updated",
    PI_DETACHED = "payment_method.detached",
    PI_UPDATED = "payment_method.updated",
}
