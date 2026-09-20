import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CurrentUser, AuthenticatedUser } from "../../common/decorators/current-user.decorator";
import { CreateCampaignDto } from "./dto/create-campaign.dto";
import { MarketingService } from "./marketing.service";

@ApiTags("marketing")
@Controller("organisations/:organisationId/marketing/campaigns")
export class MarketingController {
  constructor(private readonly marketing: MarketingService) {}

  @Get("stats")
  stats(@CurrentUser() user: AuthenticatedUser, @Param("organisationId") organisationId: string) {
    return this.marketing.stats(organisationId, user.id);
  }

  @Get()
  list(@CurrentUser() user: AuthenticatedUser, @Param("organisationId") organisationId: string) {
    return this.marketing.list(organisationId, user.id);
  }

  @Get(":campaignId")
  findOne(
    @CurrentUser() user: AuthenticatedUser,
    @Param("organisationId") organisationId: string,
    @Param("campaignId") campaignId: string,
  ) {
    return this.marketing.findOne(organisationId, campaignId, user.id);
  }

  @Post()
  create(
    @CurrentUser() user: AuthenticatedUser,
    @Param("organisationId") organisationId: string,
    @Body() dto: CreateCampaignDto,
  ) {
    return this.marketing.create(organisationId, user.id, dto);
  }

  @Post(":campaignId/send")
  send(
    @CurrentUser() user: AuthenticatedUser,
    @Param("organisationId") organisationId: string,
    @Param("campaignId") campaignId: string,
  ) {
    return this.marketing.send(organisationId, campaignId, user.id);
  }
}
