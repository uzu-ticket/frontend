import { Module } from "@nestjs/common";
import { mqttClientProvider } from "./mqtt-client.provider";
import { MqttLifecycleService } from "./mqtt-lifecycle.service";
import { RealtimeEventBus } from "./realtime-event-bus.service";
import { RealtimeGateway } from "./realtime.gateway";

@Module({
  providers: [mqttClientProvider, MqttLifecycleService, RealtimeEventBus, RealtimeGateway],
  exports: [RealtimeEventBus],
})
export class RealtimeModule {}
