import { Inject, Logger, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import type { Server, Socket } from "socket.io";
import type Redis from "ioredis";
import { REDIS_CLIENT } from "../../common/redis/redis.module";
import { REDIS_TOPIC_PREFIX } from "./realtime-event-bus.service";

/**
 * Browser-facing half of the realtime stack (RealtimeEventBus is the other
 * half). Clients join a "room" per topic they care about — e.g.
 * `event.<eventId>.dashboard` for the live sales dashboard, or
 * `event.<eventId>.scan` for gate-side admission broadcasts — then this
 * gateway rebroadcasts whatever RealtimeEventBus published to Redis.
 */
// TODO(production): this namespace has no per-socket auth yet — a client
// can subscribe to any topic string it guesses. Fine for local/dev; add a
// handshake JWT check + per-topic authorization (does this user have
// dashboard access to this event/org?) before exposing this publicly.
@WebSocketGateway({ namespace: "/realtime", cors: { origin: "*" } })
export class RealtimeGateway implements OnGatewayConnection, OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RealtimeGateway.name);
  private subscriber!: Redis;

  @WebSocketServer()
  server!: Server;

  constructor(@Inject(REDIS_CLIENT) private readonly redis: Redis) {}

  onModuleInit() {
    this.subscriber = this.redis.duplicate();
    this.subscriber.psubscribe(`${REDIS_TOPIC_PREFIX}*`);
    this.subscriber.on("pmessage", (_pattern, channel, message) => {
      const topic = channel.slice(REDIS_TOPIC_PREFIX.length);
      this.server?.to(topic).emit(topic, JSON.parse(message));
    });
  }

  async onModuleDestroy() {
    await this.subscriber?.quit();
  }

  handleConnection(client: Socket) {
    this.logger.debug(`Client connected: ${client.id}`);
  }

  @SubscribeMessage("subscribe")
  handleSubscribe(@ConnectedSocket() client: Socket, @MessageBody() body: { topic: string }) {
    client.join(body.topic);
    return { subscribed: body.topic };
  }

  @SubscribeMessage("unsubscribe")
  handleUnsubscribe(@ConnectedSocket() client: Socket, @MessageBody() body: { topic: string }) {
    client.leave(body.topic);
    return { unsubscribed: body.topic };
  }
}
