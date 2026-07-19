import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { AppConfigService } from "../../config/app-config.service";

/**
 * Stand-in for a real internal Platform Admin auth system (PRD persona
 * "Platform Admin (internal)" — KYB review, fraud ops, payouts oversight).
 * Gates by allow-listed email (PLATFORM_ADMIN_EMAILS) rather than an org
 * role, since platform admins aren't scoped to any single organisation.
 */
@Injectable()
export class PlatformAdminGuard implements CanActivate {
  constructor(private readonly config: AppConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const email: string | undefined = request.user?.email;
    if (!email || !this.config.platformAdminEmails.includes(email.toLowerCase())) {
      throw new ForbiddenException("Platform admin access required");
    }
    return true;
  }
}
