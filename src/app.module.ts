import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { ScheduleModule } from "@nestjs/schedule";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { BullModule } from "@nestjs/bullmq";

import { AppConfigModule } from "./config/app-config.module";
import { AppConfigService } from "./config/app-config.service";
import { PrismaModule } from "./prisma/prisma.module";
import { AuditModule } from "./common/audit/audit.module";
import { CommonAuthModule } from "./common/auth/common-auth.module";
import { JwtAuthGuard } from "./common/auth/jwt-auth.guard";
import { RedisModule } from "./common/redis/redis.module";
import { NotificationsModule } from "./common/notifications/notifications.module";
import { StorageModule } from "./common/storage/storage.module";

import { AuthModule } from "./modules/auth/auth.module";
import { UsersModule } from "./modules/users/users.module";
import { OrganisationsModule } from "./modules/organisations/organisations.module";
import { EventsModule } from "./modules/events/events.module";
import { DiscoveryModule } from "./modules/discovery/discovery.module";
import { OrdersModule } from "./modules/orders/orders.module";
import { PaymentsModule } from "./modules/payments/payments.module";
import { TicketsModule } from "./modules/tickets/tickets.module";
import { DeliveryModule } from "./modules/delivery/delivery.module";
import { ScannerModule } from "./modules/scanner/scanner.module";
import { RealtimeModule } from "./modules/realtime/realtime.module";
import { WalletsModule } from "./modules/wallets/wallets.module";
import { WithdrawalsModule } from "./modules/withdrawals/withdrawals.module";
import { DashboardModule } from "./modules/dashboard/dashboard.module";
import { PromotersModule } from "./modules/promoters/promoters.module";
import { MarketingModule } from "./modules/marketing/marketing.module";
import { IntegrationsModule } from "./modules/integrations/integrations.module";

@Module({
  imports: [
    AppConfigModule,
    PrismaModule,
    RedisModule,
    NotificationsModule,
    StorageModule,
    AuditModule,
    CommonAuthModule,
    ScheduleModule.forRoot(),
    ThrottlerModule.forRootAsync({
      imports: [AppConfigModule],
      inject: [AppConfigService],
      useFactory: () => ({
        throttlers: [{ ttl: 60_000, limit: 120 }],
      }),
    }),
    BullModule.forRootAsync({
      imports: [AppConfigModule],
      inject: [AppConfigService],
      useFactory: (config: AppConfigService) => ({
        connection: { url: config.redisUrl },
      }),
    }),

    // M1
    AuthModule,
    UsersModule,
    OrganisationsModule,
    EventsModule,
    OrdersModule,
    PaymentsModule,
    TicketsModule,
    DeliveryModule,
    WalletsModule,
    DashboardModule,

    // M2
    ScannerModule,
    RealtimeModule,

    // M3
    WithdrawalsModule,
    DiscoveryModule,

    // Stubs (M4/M5)
    PromotersModule,
    MarketingModule,
    IntegrationsModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}
