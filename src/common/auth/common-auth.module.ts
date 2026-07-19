import { Global, Module } from "@nestjs/common";
import { PermissionsService } from "./permissions.service";
import { PermissionsGuard } from "./permissions.guard";
import { PlatformAdminGuard } from "./platform-admin.guard";

/**
 * Exports the permission primitives used app-wide. Deliberately does NOT
 * export JwtAuthGuard (that needs the 'jwt' passport strategy registered by
 * modules/auth) or register any guards globally — AppModule wires those via
 * APP_GUARD once modules/auth has registered the strategy.
 */
@Global()
@Module({
  providers: [PermissionsService, PermissionsGuard, PlatformAdminGuard],
  exports: [PermissionsService, PermissionsGuard, PlatformAdminGuard],
})
export class CommonAuthModule {}
