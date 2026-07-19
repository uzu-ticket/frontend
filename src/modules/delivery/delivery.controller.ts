import { Body, Controller, Param, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Throttle } from "@nestjs/throttler";
import { CurrentUser, AuthenticatedUser } from "../../common/decorators/current-user.decorator";
import { DeliveryService } from "./delivery.service";
import { ResendAllDto, ResendSelectedDto, RegenerateTicketDto } from "./dto/resend.dto";

@ApiTags("delivery")
@Controller()
export class DeliveryController {
  constructor(private readonly deliveryService: DeliveryService) {}

  /** PRD §3.6 rate limit: bulk resend is capped tighter than the global default. */
  @Throttle({ default: { limit: 5, ttl: 3_600_000 } })
  @Post("organisations/:organisationId/events/:eventId/resend/all")
  resendAll(
    @CurrentUser() user: AuthenticatedUser,
    @Param("organisationId") organisationId: string,
    @Param("eventId") eventId: string,
    @Body() dto: ResendAllDto,
  ) {
    return this.deliveryService.resendAllForEvent(organisationId, eventId, user.id, dto.reason);
  }

  @Throttle({ default: { limit: 20, ttl: 3_600_000 } })
  @Post("organisations/:organisationId/events/:eventId/resend/selected")
  resendSelected(
    @CurrentUser() user: AuthenticatedUser,
    @Param("organisationId") organisationId: string,
    @Body() dto: ResendSelectedDto,
  ) {
    return this.deliveryService.resendSelected(organisationId, dto.ticketIds, user.id, dto.reason);
  }

  @Post("organisations/:organisationId/tickets/:ticketId/regenerate")
  regenerate(
    @CurrentUser() user: AuthenticatedUser,
    @Param("organisationId") organisationId: string,
    @Param("ticketId") ticketId: string,
    @Body() dto: RegenerateTicketDto,
  ) {
    return this.deliveryService.regenerateAndVoid(organisationId, ticketId, user.id, dto.reason);
  }
}
