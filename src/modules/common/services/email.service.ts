import { Injectable, InternalServerErrorException } from "@nestjs/common";
import * as nodemailer from "nodemailer";
import { Transporter } from "nodemailer";
import SMTPTransport, { MailOptions } from "nodemailer/lib/smtp-transport";
import configuration from "src/core/config/configuration";
import { MailerService } from "@nestjs-modules/mailer";
import { SentMessageInfo } from "../interfaces/email.interfaces";
import { Errors } from "../../../core/responses";
import { EmailErrors } from "../responses/email.error.responses";

@Injectable()
export class EmailService {
    private transporter: Transporter<SMTPTransport.SentMessageInfo>;

    constructor(private readonly mailerService: MailerService) {}

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
    async sendVerificationEmail(email: string, name: string, token: string): Promise<boolean> {
        try {
            const sentMessageInfo: SentMessageInfo = await this.mailerService.sendMail({
                to: email, // list of receivers
                subject: "Account Verification", // Subject line
                template: "verification",
                context: { name, verificationLink: `${configuration().email.verifyUrl}/${token}` },
            });
            return sentMessageInfo.accepted.includes(email);
        } catch (error) {
            throw new InternalServerErrorException(EmailErrors.SEND_VERIFICATION_EMAIL_FAILED);
        }
    }
}
