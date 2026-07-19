import { Controller, Get, Param } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Public } from "../../common/decorators/public.decorator";
import { TicketsService } from "./tickets.service";

@ApiTags("tickets")
@Controller("tickets")
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  /** Ticket id is an unguessable UUIDv7 — same capability-token pattern as orders. */
  @Public()
  @Get(":ticketId")
  findOne(@Param("ticketId") ticketId: string) {
    return this.ticketsService.findOne(ticketId);
  }
}
