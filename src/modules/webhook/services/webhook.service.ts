// noinspection HtmlDeprecatedTag,XmlDeprecatedElement,HtmlDeprecatedAttribute

import { Injectable } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { OnEvent } from "@nestjs/event-emitter";
import { PushoverPayload, PushoverRequestDto } from "../../../core/interfaces";
import configuration from "../../../core/config/configuration";
import { User } from "src/modules/auth/entities/user.entity";
import { Events } from "../enums";
import * as moment from "moment";

@Injectable()
export class WebhookService {
    static sendMessage(payload: PushoverPayload, token?: string): void {
        const requestDto: PushoverRequestDto = {
            user: configuration().pushover.user,
            token: token ?? configuration().pushover.token,
            html: 1,
            ...payload,
        };
        const http = new HttpService();
        http.post(configuration().pushover.url, requestDto).subscribe();
    }

    @OnEvent(Events.USER_REGISTERED)
    onUserRegistered(user: User): void {
        const title = "Alert";
        const createdAt = moment(user.createdAt).format("YYYY-MM-DD / hh:mm:ss a");
        // const message = `
        //     <font color='#ff8c00'><b>A new user has been ${user.createdBy ? "created" : "registered"}!</b></font><br>
        //     <font color='#ff0000'><b>* </b></font><font color='green'><b>Name&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: </font><font color='white'><b>${
        //         user.name
        //     }</b></font>
        //    <font color='#ff0000'><b>* </b></font><font color='green'><b>Course&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: </font><font color='white'><b>${
        //        user.course.name + " [" + user.course.code + "]"
        //    }</b></font>
        //     <font color='#ff0000'><b>* </b></font><font color='green'><b>Student ID&nbsp;&nbsp;: </font><font color='white'><b>${
        //         user.studentIdString
        //     }</b></font>
        //     <font color='#ff0000'><b>* </b></font><font color='green'><b>On&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: </font><font color='white'><b>${createdAt}</b></font><br>`;
        // const payload: PushoverPayload = { title, message };
        const payload: PushoverPayload = { title, message: createdAt };
        WebhookService.sendMessage(payload);
    }

    @OnEvent(Events.ERROR)
    onError(error: Error): void {
        WebhookService.sendError(error);
    }

    static sendError(error: Error): void {
        const title = "Error";
        const message = `
            <font color='#ff8c00'>${error.message}</font><br>
            <font color='#ff0000'>${error.stack}</font>`;
        const payload: PushoverPayload = { title, message };
        this.sendMessage(payload, configuration().pushover.errorToken);
    }
}
