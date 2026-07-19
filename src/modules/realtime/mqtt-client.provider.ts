import { FactoryProvider } from "@nestjs/common";
import * as mqtt from "mqtt";
import { AppConfigService } from "../../config/app-config.service";

export const MQTT_CLIENT = "MQTT_CLIENT";

/**
 * PRD §4.1 stack choice: "MQTT broker + WebSocket gateway" for scan sync
 * and live dashboard updates. The server publishes admissions/revocations
 * here so any MQTT-capable scanner app (or a shared-Wi-Fi Pro coordinator
 * box, integrity doc §5.1.5) can subscribe directly, without going through
 * the browser-oriented Socket.IO gateway.
 */
export const mqttClientProvider: FactoryProvider<mqtt.MqttClient> = {
  provide: MQTT_CLIENT,
  inject: [AppConfigService],
  useFactory: (config: AppConfigService) => mqtt.connect(config.mqttUrl, { reconnectPeriod: 2000 }),
};
