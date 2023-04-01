import { WSError, WSMessageResponse, WSResponse } from "../interfaces";
import { SocketEvent } from "../enums";

// noinspection JSUnusedGlobalSymbols
export class WS {
    static errorResponse(error: any): WSError {
        return { event: SocketEvent.ERROR, data: error };
    }

    static messageResponse<T>(message: T): WSResponse<WSMessageResponse<T>> {
        return { event: SocketEvent.ERROR, data: { message } };
    }

    static response<T>(data: T): WSResponse<T> {
        return { event: SocketEvent.ERROR, data };
    }
}
