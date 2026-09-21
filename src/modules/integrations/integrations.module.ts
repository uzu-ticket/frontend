import { Module } from "@nestjs/common";
import { IntegrationsController } from "./integrations.controller";
import { IntegrationsService } from "./integrations.service";
import { ApiKeysController } from "./api-keys.controller";
import { ApiKeysService } from "./api-keys.service";
import { CommonAuthModule } from "../../common/auth/common-auth.module";

@Module({
  imports: [CommonAuthModule],
  controllers: [IntegrationsController, ApiKeysController],
  providers: [IntegrationsService, ApiKeysService],
})
export class IntegrationsModule {}
