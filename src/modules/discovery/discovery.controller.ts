import { Controller, Delete, Get, Param, Post, Query } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Public } from "../../common/decorators/public.decorator";
import { CurrentUser, AuthenticatedUser } from "../../common/decorators/current-user.decorator";
import { DiscoveryService } from "./discovery.service";
import { BrowseEventsDto } from "./dto/browse-events.dto";

@ApiTags("discovery")
@Controller("discovery")
export class DiscoveryController {
  constructor(private readonly discoveryService: DiscoveryService) {}

  @Public()
  @Get("events")
  browse(@Query() dto: BrowseEventsDto) {
    return this.discoveryService.browseEvents(dto);
  }

  @Public()
  @Get("events/:eventId")
  getEvent(@Param("eventId") eventId: string) {
    return this.discoveryService.getPublicEvent(eventId);
  }

  @Post("events/:eventId/follow")
  follow(@CurrentUser() user: AuthenticatedUser, @Param("eventId") eventId: string) {
    return this.discoveryService.follow(user.id, eventId);
  }

  @Delete("events/:eventId/follow")
  unfollow(@CurrentUser() user: AuthenticatedUser, @Param("eventId") eventId: string) {
    return this.discoveryService.unfollow(user.id, eventId);
  }

  @Get("me/followed-events")
  listFollowed(@CurrentUser() user: AuthenticatedUser) {
    return this.discoveryService.listFollowedEvents(user.id);
  }
}
