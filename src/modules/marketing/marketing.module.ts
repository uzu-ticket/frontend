import { Module } from "@nestjs/common";
import { MarketingController } from "./marketing.controller";
import { MarketingService } from "./marketing.service";

/** STUB — see README.md in this directory. PRD §3.7, milestone M5. */
@Module({ controllers: [MarketingController], providers: [MarketingService] })
export class MarketingModule {}
