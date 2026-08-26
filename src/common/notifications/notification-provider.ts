export interface SendEmailInput {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export interface SendSmsInput {
  to: string;
  body: string;
}

export interface SendResult {
  providerMessageId?: string;
}

export interface NotificationProvider {
  sendEmail(input: SendEmailInput): Promise<SendResult>;
  sendSms(input: SendSmsInput): Promise<SendResult>;
}

export const NOTIFICATION_PROVIDER = "NOTIFICATION_PROVIDER";
