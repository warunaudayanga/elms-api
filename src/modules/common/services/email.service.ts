import { Injectable } from "@nestjs/common";
import * as nodemailer from "nodemailer";
import { Transporter } from "nodemailer";
import SMTPTransport, { MailOptions } from "nodemailer/lib/smtp-transport";
import configuration from "src/core/config/configuration";

@Injectable()
export class EmailService {
    private transporter: Transporter<SMTPTransport.SentMessageInfo>;

    constructor() {
        this.configuration();
    }

    private configuration(): void {
        this.transporter = nodemailer.createTransport({
            host: configuration().email.host,
            port: configuration().email.port,
            secure: configuration().email.secure,
            auth: {
                user: configuration().email.user,
                pass: configuration().email.pass,
            },
        });
    }

    // noinspection JSUnusedGlobalSymbols
    public sendMail = (
        from: string,
        to: string,
        subject: string,
        html: string,
    ): Promise<SMTPTransport.SentMessageInfo> => new Promise((resolve, reject) => { // eslint-disable-line prettier/prettier
            const mailOptions: MailOptions = {
                from: { name: from, address: configuration().email.user },
                to,
                subject,
                html,
            };

            this.transporter.sendMail(mailOptions, (err, info) => {
                if (err) {
                    reject(err);
                }
                if (info) {
                    resolve(info);
                }
                reject(Error(undefined));
            });
        });
}
