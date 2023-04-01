/* eslint-disable lines-between-class-members */
// noinspection JSUnusedGlobalSymbols

import { Injectable } from "@nestjs/common";
import { Socket } from "socket.io";
import { LoggerService } from "../../../core/services";
import { SocketEvent } from "../enums";
import { DefaultRoles } from "src/modules/auth/enums/default-roles.enum";
import { Events } from "../../webhook/enums";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { Observable, Subject } from "rxjs";
import { WSMessage } from "../interfaces";
import { User } from "../../auth/entities/user.entity";

export interface SocketUser {
    id: number;
    role: DefaultRoles | string;
    socket: Socket;
}

@Injectable()
export class SocketService {
    private users: SocketUser[] = [];

    messageListener: Subject<WSMessage<unknown>> = new Subject<WSMessage<unknown>>();

    constructor(private readonly eventEmitter: EventEmitter2) {}

    pushMessage(wsMessage: WSMessage<unknown>): void {
        this.messageListener.next(wsMessage);
    }

    getMessageListener(): Observable<WSMessage<unknown>> {
        return this.messageListener.asObservable();
    }

    async getUserBySocket(socket: Socket): Promise<User> {
        const bearerToken = socket.handshake.auth?.token || socket.handshake.headers.authorization;
        if (!bearerToken) {
            return null;
        }
        return await this.getUserByToken(bearerToken);
    }

    async getUserByToken(bearerToken): Promise<User> {
        const [user] = (await this.eventEmitter.emitAsync(Events.USER_GET_BY_TOKEN, bearerToken)) as [User];
        return user;
    }

    async addUser(socket: Socket): Promise<boolean> {
        try {
            const { id, role } = await this.getUserBySocket(socket);
            if (!id) {
                return false;
            }
            const user = this.users.find((c) => c.id === id);
            if (user) {
                this.users[this.users.indexOf(user)] = { socket, id, role: role.name };
            } else {
                this.users.push({ socket, id, role: role.name });
            }
            console.log(`User connected: { socketId: ${socket.id}, userId: ${id} }`); // eslint-disable-line no-console
            console.log(`Users: ${this.users.length}`); // eslint-disable-line no-console
            return true;
        } catch (e) {
            LoggerService.error(e);
            return false;
        }
    }

    getUserSocket(id: number): Socket {
        return this.users.find((c) => c.id !== id)?.socket;
    }

    getUsersSockets(ids: number[]): Socket[] {
        return this.users.filter((c) => ids.includes(c.id))?.map((c) => c.socket);
    }

    removeUser(socket: Socket): void {
        this.users = this.users.filter((c) => c.socket.id !== socket.id);
        console.log(`User disconnected: ${socket.id}`); // eslint-disable-line no-console
        console.log(`Users: ${this.users.length}`); // eslint-disable-line no-console
    }

    emit<T>(event: SocketEvent | string, data: T): void;
    emit<T>(event: SocketEvent | string, role: DefaultRoles | string, data: T): void;
    emit<T>(event: SocketEvent | string, dataOrRole: T | DefaultRoles, data?: T): void {
        try {
            const dt: T = data ?? (dataOrRole as T);
            const role: DefaultRoles | undefined = data ? (dataOrRole as DefaultRoles) : undefined;
            const users = role ? this.users.filter((c) => c.role === dataOrRole) : this.users;
            users.forEach((c) => {
                c.socket.emit(event, dt);
            });
        } catch (e) {
            LoggerService.error(e);
        }
    }

    emitUser<T>(event: SocketEvent | string, userId: number, data: T): void {
        this.users.find((c) => c.id === userId)?.socket.emit(event, data);
    }
}
