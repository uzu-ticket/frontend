import { Module } from "@nestjs/common";
import { PrismaModule } from "../../prisma/prisma.module";
import { CommonAuthModule } from "../../common/auth/common-auth.module";
import { PromotersController } from "./promoters.controller";
import { PromotersService } from "./promoters.service";

@Module({
  imports: [PrismaModule, CommonAuthModule],
  controllers: [PromotersController],
  providers: [PromotersService],
  exports: [PromotersService],
})
export class PromotersModule {}
