import { SocketEvent } from "../enums";

export interface WSResponse<T> {
    event: SocketEvent;
    data: T;
}

export interface WSError extends WSResponse<any> {
    event: SocketEvent.ERROR;
    data: any;
}

export interface WSMessageResponse<T> {
    message: T;
}
