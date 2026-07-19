import { Module } from "@nestjs/common";
import { ScannerController } from "./scanner.controller";
import { ScannerService } from "./scanner.service";
import { RealtimeModule } from "../realtime/realtime.module";

@Module({
  imports: [RealtimeModule],
  controllers: [ScannerController],
  providers: [ScannerService],
  exports: [ScannerService],
})
export class ScannerModule {}
