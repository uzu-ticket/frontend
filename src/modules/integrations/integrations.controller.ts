import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import {
  AuthenticatedUser,
  CurrentUser,
} from "../../common/decorators/current-user.decorator";
import { IntegrationsService } from "./integrations.service";
import { ConnectIntegrationDto } from "./dto/connect-integration.dto";

@ApiTags("integrations")
@Controller("organisations/:organisationId/integrations")
export class IntegrationsController {
  constructor(private readonly integrationsService: IntegrationsService) {}

  /** List all integrations (catalogue merged with org connection status) */
  @Get()
  list(
    @CurrentUser() user: AuthenticatedUser,
    @Param("organisationId") organisationId: string,
  ) {
    return this.integrationsService.list(organisationId, user.id);
  }

  /** Get a single integration's detail + masked credentials */
  @Get(":provider")
  getOne(
    @CurrentUser() user: AuthenticatedUser,
    @Param("organisationId") organisationId: string,
    @Param("provider") provider: string,
  ) {
    return this.integrationsService.getOne(organisationId, user.id, provider);
  }

  /** Connect / update credentials for a provider */
  @Post(":provider/connect")
  connect(
    @CurrentUser() user: AuthenticatedUser,
    @Param("organisationId") organisationId: string,
    @Param("provider") provider: string,
    @Body() dto: ConnectIntegrationDto,
  ) {
    return this.integrationsService.connect(
      organisationId,
      user.id,
      provider,
      dto,
    );
  }

  /** Disconnect a provider (sets isConnected = false) */
  @Delete(":provider/disconnect")
  disconnect(
    @CurrentUser() user: AuthenticatedUser,
    @Param("organisationId") organisationId: string,
    @Param("provider") provider: string,
  ) {
    return this.integrationsService.disconnect(
      organisationId,
      user.id,
      provider,
    );
  }
}
