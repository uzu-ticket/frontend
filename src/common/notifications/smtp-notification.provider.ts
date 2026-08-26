import { Injectable, Logger } from "@nestjs/common";
import * as nodemailer from "nodemailer";
import Mailgun from "mailgun.js";
import { AppConfigService } from "../../config/app-config.service";
import { NotificationProvider, SendEmailInput, SendResult, SendSmsInput } from "./notification-provider";

type MailgunMessages = {
  create: (domain: string, data: Record<string, unknown>) => Promise<{ id: string }>;
};

@Injectable()
export class SmtpNotificationProvider implements NotificationProvider {
  private readonly logger = new Logger(SmtpNotificationProvider.name);
  private readonly useMailgun: boolean;
  private readonly smtpTransporter: nodemailer.Transporter | null = null;
  private readonly mgMessages: MailgunMessages | null = null;
  private readonly mgDomain: string = "";
  private readonly mgFrom: string = "";

  constructor(private readonly config: AppConfigService) {
    this.useMailgun = this.config.isProduction;

    if (this.useMailgun) {
      const mg = this.config.mailgun;
      const mailgun = new Mailgun({ formData: {} } as never);
      const client = mailgun.client({
        apiKey: mg.apiKey,
        username: "api",
        domain: mg.domain,
      } as never);
      this.mgMessages = client.messages as MailgunMessages;
      this.mgDomain = mg.domain;
      this.mgFrom = mg.from;
    } else {
      const smtp = this.config.smtp;
      this.smtpTransporter = nodemailer.createTransport({
        host: smtp.host,
        port: smtp.port,
        secure: smtp.secure,
        auth: smtp.user ? { user: smtp.user, pass: smtp.pass } : undefined,
      });
    }
  }

  async sendEmail(input: SendEmailInput): Promise<SendResult> {
    if (this.useMailgun && this.mgMessages) {
      const from = this.mgFrom || input.to;
      const result = await this.mgMessages.create(this.mgDomain, {
        from,
        to: input.to,
        subject: input.subject,
        html: input.html,
        text: input.text,
      });
      this.logger.log(`Email sent to ${input.to}: ${result.id}`);
      return { providerMessageId: result.id };
    }

    if (!this.smtpTransporter) {
      this.logger.warn(`Email to ${input.to} not sent — no provider configured`);
      return {};
    }

    const info = await this.smtpTransporter.sendMail({
      from: this.config.smtp.from,
      to: input.to,
      subject: input.subject,
      html: input.html,
      text: input.text,
    });
    this.logger.log(`Email sent to ${input.to}: ${info.messageId}`);
    return { providerMessageId: info.messageId };
  }

  async sendSms(input: SendSmsInput): Promise<SendResult> {
    if (this.useMailgun && this.mgMessages) {
      const result = await this.mgMessages.create(this.mgDomain, {
        from: this.mgFrom || "UzuTicket",
        to: input.to,
        text: input.body,
      });
      this.logger.log(`SMS sent to ${input.to}: ${result.id}`);
      return { providerMessageId: result.id };
    }

    this.logger.warn(`SMS to ${input.to} not sent — no SMS provider configured`);
    return {};
  }
}
