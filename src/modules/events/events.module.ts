import { Module } from "@nestjs/common";
import { StorageModule } from "../../common/storage/storage.module";
import { EventsController } from "./events.controller";
import { CategoriesController } from "./categories.controller";
import { EventsService } from "./events.service";
import { EventLifecycleCron } from "./event-lifecycle.cron";

@Module({
  imports: [StorageModule],
  controllers: [EventsController, CategoriesController],
  providers: [EventsService, EventLifecycleCron],
  exports: [EventsService],
})
export class EventsModule {}
