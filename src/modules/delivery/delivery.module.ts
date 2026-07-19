import { Module } from "@nestjs/common";
import { BullModule } from "@nestjs/bullmq";
import { DeliveryController } from "./delivery.controller";
import { DeliveryService } from "./delivery.service";
import { DeliveryProcessor } from "./delivery.processor";
import { SmsWhatsAppStubProvider } from "./providers/sms-whatsapp.stub";
import { TICKET_DELIVERY_QUEUE } from "./delivery.constants";
import { TicketsModule } from "../tickets/tickets.module";

@Module({
  imports: [BullModule.registerQueue({ name: TICKET_DELIVERY_QUEUE }), TicketsModule],
  controllers: [DeliveryController],
  providers: [DeliveryService, DeliveryProcessor, SmsWhatsAppStubProvider],
  exports: [DeliveryService],
})
export class DeliveryModule {}
