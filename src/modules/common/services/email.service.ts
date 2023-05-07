import { Injectable, InternalServerErrorException } from "@nestjs/common";
import configuration from "src/core/config/configuration";
import { MailerService } from "@nestjs-modules/mailer";
import { SentMessageInfo } from "../interfaces/email.interfaces";
import { EmailErrors } from "../responses/email.error.responses";

@Injectable()
export class EmailService {
    constructor(private readonly mailerService: MailerService) {}

    async sendVerificationEmail(email: string, name: string, token: string): Promise<boolean> {
        try {
            const sentMessageInfo: SentMessageInfo = await this.mailerService.sendMail({
                to: email, // list of receivers
                subject: "Account Verification", // Subject line
                template: "verification",
                context: { name, verificationLink: `${configuration().app.emailVerifyUrl}/${token}` },
            });
            return sentMessageInfo.accepted.includes(email);
        } catch (error) {
            throw new InternalServerErrorException(EmailErrors.SEND_VERIFICATION_EMAIL_FAILED);
        }
    }

    async sendPasswordResetEmail(email: string, name: string, token: string): Promise<boolean> {
        try {
            const sentMessageInfo: SentMessageInfo = await this.mailerService.sendMail({
                to: email, // list of receivers
                subject: "Reset Password", // Subject line
                template: "reset-password",
                context: { name, verificationLink: `${configuration().app.passwordResetUrl}/${token}` },
            });
            return sentMessageInfo.accepted.includes(email);
        } catch (error) {
            throw new InternalServerErrorException(EmailErrors.SEND_VERIFICATION_EMAIL_FAILED);
        }
    }
}
