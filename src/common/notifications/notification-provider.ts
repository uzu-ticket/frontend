export interface SendEmailInput {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export interface SendResult {
  providerMessageId?: string;
}

/**
 * Transactional email interface. SMS/WhatsApp get the same shape of
 * interface in delivery/providers/*.stub.ts but are not wired to a real
 * provider yet (PRD open question 13).
 */
export interface NotificationProvider {
  sendEmail(input: SendEmailInput): Promise<SendResult>;
}

export const NOTIFICATION_PROVIDER = "NOTIFICATION_PROVIDER";
