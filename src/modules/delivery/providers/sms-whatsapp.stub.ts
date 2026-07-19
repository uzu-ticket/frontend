import { Injectable, NotImplementedException } from "@nestjs/common";

/**
 * PRD open question 13: WhatsApp/SMS delivery cost + timing was undecided
 * at launch. `ticket_deliveries.channel` already models `sms`/`whatsapp`
 * (see schema), so the DB and DeliveryService branch cleanly on channel —
 * only the actual provider call is unimplemented. Wire a real SMS/WhatsApp
 * API here (Termii, Twilio, WhatsApp Business API, ...) when that question
 * resolves; DeliveryProcessor already routes to whichever provider matches
 * the delivery's channel.
 */
@Injectable()
export class SmsWhatsAppStubProvider {
  sendSms(_to: string, _message: string): Promise<{ providerMessageId?: string }> {
    throw new NotImplementedException("SMS delivery is not implemented yet");
  }

  sendWhatsApp(_to: string, _message: string): Promise<{ providerMessageId?: string }> {
    throw new NotImplementedException("WhatsApp delivery is not implemented yet");
  }
}
