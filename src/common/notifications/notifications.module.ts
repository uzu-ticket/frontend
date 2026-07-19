import { Global, Module } from "@nestjs/common";
import { SmtpNotificationProvider } from "./smtp-notification.provider";
import { NOTIFICATION_PROVIDER } from "./notification-provider";

@Global()
@Module({
  providers: [SmtpNotificationProvider, { provide: NOTIFICATION_PROVIDER, useExisting: SmtpNotificationProvider }],
  exports: [NOTIFICATION_PROVIDER],
})
export class NotificationsModule {}
