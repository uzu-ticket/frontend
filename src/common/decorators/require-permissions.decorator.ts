import { SetMetadata } from "@nestjs/common";
import { Permission } from "../auth/permissions";

export const PERMISSIONS_KEY = "requiredPermissions";

/**
 * For controller routes where `:organisationId` is a direct route param
 * (see PermissionsGuard). For resource-nested routes (events, orders, ...)
 * call PermissionsService.assertPermission(...) in the service instead,
 * after resolving the resource's organisationId.
 */
export const RequirePermissions = (...permissions: Permission[]) => SetMetadata(PERMISSIONS_KEY, permissions);
