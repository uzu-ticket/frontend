import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CurrentUser, AuthenticatedUser } from "../../common/decorators/current-user.decorator";
import { PromotersService } from "./promoters.service";
import { CreatePromoterLinkDto } from "./dto/create-promoter-link.dto";

@ApiTags("promoters")
@Controller("organisations/:organisationId/promoters")
export class PromotersController {
  constructor(private readonly promotersService: PromotersService) {}

  @Get("summary")
  getSummary(@CurrentUser() user: AuthenticatedUser, @Param("organisationId") organisationId: string) {
    return this.promotersService.getSummary(organisationId, user.id);
  }

  @Post("links")
  createLink(
    @CurrentUser() user: AuthenticatedUser,
    @Param("organisationId") organisationId: string,
    @Body() dto: CreatePromoterLinkDto,
  ) {
    return this.promotersService.createLink(organisationId, user.id, dto);
  }

  @Get("links/:linkId")
  getLink(
    @CurrentUser() user: AuthenticatedUser,
    @Param("organisationId") organisationId: string,
    @Param("linkId") linkId: string,
  ) {
    return this.promotersService.getLink(organisationId, user.id, linkId);
  }

  @Post("links/:linkId/accept")
  acceptInvitation(
    @CurrentUser() user: AuthenticatedUser,
    @Param("organisationId") organisationId: string,
    @Param("linkId") linkId: string,
  ) {
    return this.promotersService.acceptInvitation(organisationId, user.id, linkId);
  }

  @Post("links/:linkId/decline")
  declineInvitation(
    @CurrentUser() user: AuthenticatedUser,
    @Param("organisationId") organisationId: string,
    @Param("linkId") linkId: string,
  ) {
    return this.promotersService.declineInvitation(organisationId, user.id, linkId);
  }

  @Get(":promoterId")
  getPromoter(
    @CurrentUser() user: AuthenticatedUser,
    @Param("organisationId") organisationId: string,
    @Param("promoterId") promoterId: string,
  ) {
    return this.promotersService.getPromoter(organisationId, user.id, promoterId);
  }

  @Get()
  list(@CurrentUser() user: AuthenticatedUser, @Param("organisationId") organisationId: string) {
    return this.promotersService.list(organisationId, user.id);
  }
}
