import { Module } from "@nestjs/common";
import { TicketsController } from "./tickets.controller";
import { TicketsService } from "./tickets.service";
import { SigningService } from "./signing/signing.service";
import { KEY_PROVIDER } from "./signing/key-provider";
import { LocalEncryptedKeyProvider } from "./signing/local-encrypted-key.provider";

@Module({
  controllers: [TicketsController],
  providers: [TicketsService, SigningService, { provide: KEY_PROVIDER, useClass: LocalEncryptedKeyProvider }],
  exports: [TicketsService, SigningService],
})
export class TicketsModule {}
