import { Module } from "@nestjs/common";
import { OrganisationsController } from "./organisations.controller";
import { OrganisationsService } from "./organisations.service";
import { StorageModule } from "../../common/storage/storage.module";
import { CacService } from "./cac.service";

@Module({
  imports: [StorageModule],
  controllers: [OrganisationsController],
  providers: [OrganisationsService, CacService],
  exports: [OrganisationsService],
})
export class OrganisationsModule {}
