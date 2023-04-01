import { ArgumentsHost, Catch, HttpException } from "@nestjs/common";
import { BaseWsExceptionFilter, WsException } from "@nestjs/websockets";
import { Socket } from "socket.io";
import { SocketEvent } from "../enums";

@Catch(WsException, HttpException)
export class WSExceptionFilter extends BaseWsExceptionFilter {
    public catch(exception: WsException, host: ArgumentsHost): void {
        const socket = <Socket>host.switchToWs().getClient();
        this.handleError(socket, exception);
    }

    // @ts-ignore
    public handleError(socket: Socket, exception: HttpException | WsException): void {
        if (exception instanceof HttpException) {
            socket.emit(SocketEvent.ERROR, exception.getResponse());
        } else {
            socket.emit(SocketEvent.ERROR, exception.getError());
        }
    }
}
