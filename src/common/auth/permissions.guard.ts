import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { PERMISSIONS_KEY } from "../decorators/require-permissions.decorator";
import { PermissionsService } from "./permissions.service";
import { Permission } from "./permissions";

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly permissionsService: PermissionsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const required = this.reflector.getAllAndOverride<Permission | Permission[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!required) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const organisationId: string | undefined = request.params?.organisationId;
    const userId: string | undefined = request.user?.id;

    if (!organisationId) {
      throw new ForbiddenException(
        "PermissionsGuard requires an :organisationId route param — use PermissionsService directly for resource-nested routes",
      );
    }
    if (!userId) {
      throw new ForbiddenException("Not authenticated");
    }

    const permissions = (Array.isArray(required) ? required : [required]) as Permission[];
    for (const permission of permissions) {
      // eslint-disable-next-line no-await-in-loop
      if (!(await this.permissionsService.hasPermission(userId, organisationId, permission))) {
        throw new ForbiddenException(`Missing permission: ${permission}`);
      }
    }
    return true;
  }
}
