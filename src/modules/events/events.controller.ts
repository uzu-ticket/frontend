import { Body, Controller, Delete, Get, Param, Patch, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import "multer";
import { ApiTags } from "@nestjs/swagger";
import { CurrentUser, AuthenticatedUser } from "../../common/decorators/current-user.decorator";
import { EventsService } from "./events.service";
import { CreateEventDto } from "./dto/create-event.dto";
import { UpdateEventDto } from "./dto/update-event.dto";
import { CreateTicketTypeDto, UpdateTicketTypeDto } from "./dto/ticket-type.dto";
import { AddEventImageDto } from "./dto/add-image.dto";

@ApiTags("events")
@Controller("organisations/:organisationId/events")
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  create(
    @CurrentUser() user: AuthenticatedUser,
    @Param("organisationId") organisationId: string,
    @Body() dto: CreateEventDto,
  ) {
    return this.eventsService.create(organisationId, user.id, dto);
  }

  @Get()
  findAll(@CurrentUser() user: AuthenticatedUser, @Param("organisationId") organisationId: string) {
    return this.eventsService.findAllForOrg(organisationId, user.id);
  }

  @Get(":eventId")
  findOne(
    @CurrentUser() user: AuthenticatedUser,
    @Param("organisationId") organisationId: string,
    @Param("eventId") eventId: string,
  ) {
    return this.eventsService.findOneForOrg(organisationId, eventId, user.id);
  }

  @Patch(":eventId")
  update(
    @CurrentUser() user: AuthenticatedUser,
    @Param("organisationId") organisationId: string,
    @Param("eventId") eventId: string,
    @Body() dto: UpdateEventDto,
  ) {
    return this.eventsService.update(organisationId, eventId, user.id, dto);
  }

  @Post(":eventId/publish")
  publish(
    @CurrentUser() user: AuthenticatedUser,
    @Param("organisationId") organisationId: string,
    @Param("eventId") eventId: string,
  ) {
    return this.eventsService.publish(organisationId, eventId, user.id);
  }

  @Post(":eventId/cancel")
  cancel(
    @CurrentUser() user: AuthenticatedUser,
    @Param("organisationId") organisationId: string,
    @Param("eventId") eventId: string,
  ) {
    return this.eventsService.cancel(organisationId, eventId, user.id);
  }

  @Post(":eventId/ticket-types")
  addTicketType(
    @CurrentUser() user: AuthenticatedUser,
    @Param("organisationId") organisationId: string,
    @Param("eventId") eventId: string,
    @Body() dto: CreateTicketTypeDto,
  ) {
    return this.eventsService.addTicketType(organisationId, eventId, user.id, dto);
  }

  @Patch(":eventId/ticket-types/:ticketTypeId")
  updateTicketType(
    @CurrentUser() user: AuthenticatedUser,
    @Param("organisationId") organisationId: string,
    @Param("eventId") eventId: string,
    @Param("ticketTypeId") ticketTypeId: string,
    @Body() dto: UpdateTicketTypeDto,
  ) {
    return this.eventsService.updateTicketType(organisationId, eventId, ticketTypeId, user.id, dto);
  }

  @Delete(":eventId/ticket-types/:ticketTypeId")
  removeTicketType(
    @CurrentUser() user: AuthenticatedUser,
    @Param("organisationId") organisationId: string,
    @Param("eventId") eventId: string,
    @Param("ticketTypeId") ticketTypeId: string,
  ) {
    return this.eventsService.removeTicketType(organisationId, eventId, ticketTypeId, user.id);
  }

  @Post(":eventId/images")
  addImage(
    @CurrentUser() user: AuthenticatedUser,
    @Param("organisationId") organisationId: string,
    @Param("eventId") eventId: string,
    @Body() dto: AddEventImageDto,
  ) {
    return this.eventsService.addImage(organisationId, eventId, user.id, dto);
  }

  @Post(":eventId/uploads")
  @UseInterceptors(
    FileInterceptor("image", {
      limits: { fileSize: 5 * 1024 * 1024 },
      fileFilter: (_request, file, callback) => {
        callback(null, file.mimetype.startsWith("image/"));
      },
    }),
  )
  uploadImage(
    @CurrentUser() user: AuthenticatedUser,
    @Param("organisationId") organisationId: string,
    @Param("eventId") eventId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.eventsService.uploadImage(organisationId, eventId, user.id, file);
  }

  @Delete(":eventId/images/:imageId")
  removeImage(
    @CurrentUser() user: AuthenticatedUser,
    @Param("organisationId") organisationId: string,
    @Param("eventId") eventId: string,
    @Param("imageId") imageId: string,
  ) {
    return this.eventsService.removeImage(organisationId, eventId, imageId, user.id);
  }
}
