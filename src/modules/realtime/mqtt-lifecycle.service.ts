import { Inject, Injectable, Logger, OnApplicationShutdown } from "@nestjs/common";
import type { MqttClient } from "mqtt";
import { MQTT_CLIENT } from "./mqtt-client.provider";

/**
 * mqtt.connect() returns a client with its own reconnect loop and no
 * NestJS lifecycle awareness — left open, it keeps the process (and, in
 * tests, Jest) alive after app.close(). This hooks Nest's shutdown so
 * `.end()` actually runs instead of leaking the socket.
 */
@Injectable()
export class MqttLifecycleService implements OnApplicationShutdown {
  private readonly logger = new Logger(MqttLifecycleService.name);

  constructor(@Inject(MQTT_CLIENT) private readonly client: MqttClient) {}

  onApplicationShutdown(): void {
    this.client.end(true, {}, () => this.logger.log("MQTT client closed"));
  }
}
