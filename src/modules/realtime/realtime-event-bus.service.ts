import { Inject, Injectable, Logger } from "@nestjs/common";
import type Redis from "ioredis";
import type { MqttClient } from "mqtt";
import { REDIS_CLIENT } from "../../common/redis/redis.module";
import { MQTT_CLIENT } from "./mqtt-client.provider";

export const REDIS_TOPIC_PREFIX = "uzu:";

/**
 * Single publish point feeding both transports (see mqtt-client.provider.ts
 * doc comment): Redis pub/sub for RealtimeGateway to rebroadcast to browser
 * Socket.IO clients (and to keep multi-instance deployments in sync), MQTT
 * for scanner-app / coordinator-box subscribers.
 *
 * Topic convention: dot-separated, e.g. `event.<eventId>.scan`,
 * `event.<eventId>.dashboard`, `device.<deviceId>.revoked`.
 */
@Injectable()
export class RealtimeEventBus {
  private readonly logger = new Logger(RealtimeEventBus.name);

  constructor(
    @Inject(REDIS_CLIENT) private readonly redis: Redis,
    @Inject(MQTT_CLIENT) private readonly mqtt: MqttClient,
  ) {}

  async publish(topic: string, payload: unknown): Promise<void> {
    const message = JSON.stringify(payload);
    await this.redis.publish(`${REDIS_TOPIC_PREFIX}${topic}`, message);
    this.mqtt.publish(`uzu/${topic.replace(/\./g, "/")}`, message, { qos: 0 }, (err) => {
      if (err) this.logger.warn(`MQTT publish failed for topic ${topic}: ${err.message}`);
    });
  }
}
