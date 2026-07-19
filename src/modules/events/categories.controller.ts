import { Controller, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Public } from "../../common/decorators/public.decorator";
import { EventsService } from "./events.service";

@ApiTags("categories")
@Controller("categories")
export class CategoriesController {
  constructor(private readonly eventsService: EventsService) {}

  @Public()
  @Get()
  list() {
    return this.eventsService.listCategories();
  }
}
