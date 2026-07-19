import { Global, Inject, Module, OnApplicationShutdown } from "@nestjs/common";
import Redis from "ioredis";
import { AppConfigModule } from "../../config/app-config.module";
import { AppConfigService } from "../../config/app-config.service";

export const REDIS_CLIENT = "REDIS_CLIENT";

/**
 * Single ioredis connection shared by OTP storage, the pub/sub event bus
 * (realtime module), and anything else that needs Redis directly. BullMQ
 * queues take their own connection option (see modules that register
 * BullModule.registerQueue) rather than reusing this client.
 */
@Global()
@Module({
  imports: [AppConfigModule],
  providers: [
    {
      provide: REDIS_CLIENT,
      inject: [AppConfigService],
      useFactory: (config: AppConfigService) => new Redis(config.redisUrl, { maxRetriesPerRequest: null }),
    },
  ],
  exports: [REDIS_CLIENT],
})
export class RedisModule implements OnApplicationShutdown {
  constructor(@Inject(REDIS_CLIENT) private readonly client: Redis) {}

  async onApplicationShutdown(): Promise<void> {
    await this.client.quit();
  }
}
