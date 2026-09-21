import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import {
  AuthenticatedUser,
  CurrentUser,
} from "../../common/decorators/current-user.decorator";
import { ApiKeysService } from "./api-keys.service";
import { CreateApiKeyDto } from "./dto/create-api-key.dto";

@ApiTags("api-keys")
@Controller("organisations/:organisationId/api-keys")
export class ApiKeysController {
  constructor(private readonly apiKeysService: ApiKeysService) {}

  /** List all API keys for an organisation */
  @Get()
  list(
    @CurrentUser() user: AuthenticatedUser,
    @Param("organisationId") organisationId: string,
  ) {
    return this.apiKeysService.list(organisationId, user.id);
  }

  /** Generate a new API key for an organisation */
  @Post()
  create(
    @CurrentUser() user: AuthenticatedUser,
    @Param("organisationId") organisationId: string,
    @Body() dto: CreateApiKeyDto,
  ) {
    return this.apiKeysService.create(organisationId, user.id, dto);
  }

  /** Revoke an API key */
  @Delete(":keyId/revoke")
  revoke(
    @CurrentUser() user: AuthenticatedUser,
    @Param("organisationId") organisationId: string,
    @Param("keyId") keyId: string,
  ) {
    return this.apiKeysService.revoke(organisationId, user.id, keyId);
  }
}
