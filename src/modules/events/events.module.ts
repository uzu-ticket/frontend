import { Module } from "@nestjs/common";
import { EventsController } from "./events.controller";
import { CategoriesController } from "./categories.controller";
import { EventsService } from "./events.service";
import { EventLifecycleCron } from "./event-lifecycle.cron";

@Module({
  controllers: [EventsController, CategoriesController],
  providers: [EventsService, EventLifecycleCron],
  exports: [EventsService],
})
export class EventsModule {}
