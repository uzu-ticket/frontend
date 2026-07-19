import { Injectable, Logger } from "@nestjs/common";
import * as nodemailer from "nodemailer";
import { AppConfigService } from "../../config/app-config.service";
import { NotificationProvider, SendEmailInput, SendResult } from "./notification-provider";

/**
 * Dev-friendly default: plain SMTP (works against Mailhog locally, or any
 * real SMTP relay in prod). Swap for a dedicated ESP (Postmark/SendGrid/SES)
 * by implementing NotificationProvider and rebinding NOTIFICATION_PROVIDER.
 */
@Injectable()
export class SmtpNotificationProvider implements NotificationProvider {
  private readonly logger = new Logger(SmtpNotificationProvider.name);
  private readonly transporter: nodemailer.Transporter;

  constructor(private readonly config: AppConfigService) {
    const smtp = this.config.smtp;
    this.transporter = nodemailer.createTransport({
      host: smtp.host,
      port: smtp.port,
      secure: smtp.secure,
      auth: smtp.user ? { user: smtp.user, pass: smtp.pass } : undefined,
    });
  }

  async sendEmail(input: SendEmailInput): Promise<SendResult> {
    const info = await this.transporter.sendMail({
      from: this.config.smtp.from,
      to: input.to,
      subject: input.subject,
      html: input.html,
      text: input.text,
    });
    this.logger.log(`Email sent to ${input.to}: ${info.messageId}`);
    return { providerMessageId: info.messageId };
  }
}
