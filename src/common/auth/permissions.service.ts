import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { permissionsForRole, Permission } from "./permissions";

/**
 * Central place that answers "can user X do permission Y in organisation Z".
 * Used directly by services for resource-nested routes (e.g. an event's
 * organisationId isn't in the URL) and by PermissionsGuard for routes where
 * organisationId is a direct route param.
 */
@Injectable()
export class PermissionsService {
  constructor(private readonly prisma: PrismaService) {}

  async getPermissions(userId: string, organisationId: string): Promise<Permission[]> {
    const memberships = await this.prisma.organisationMember.findMany({
      where: {
        userId,
        organisationId,
        revokedAt: null,
        acceptedAt: { not: null },
      },
      select: { role: true },
    });

    const permissions = new Set<Permission>();
    for (const membership of memberships) {
      for (const permission of permissionsForRole(membership.role)) {
        permissions.add(permission);
      }
    }
    return [...permissions];
  }

  async hasPermission(userId: string, organisationId: string, permission: Permission): Promise<boolean> {
    const permissions = await this.getPermissions(userId, organisationId);
    return permissions.includes(permission);
  }

  async assertPermission(userId: string, organisationId: string, permission: Permission): Promise<void> {
    if (!(await this.hasPermission(userId, organisationId, permission))) {
      throw new ForbiddenException(`Missing permission: ${permission}`);
    }
  }

  /** For read operations any accepted org member may access, regardless of role. */
  async assertMembership(userId: string, organisationId: string): Promise<void> {
    const member = await this.prisma.organisationMember.findFirst({
      where: { userId, organisationId, acceptedAt: { not: null }, revokedAt: null },
      select: { id: true },
    });
    if (!member) {
      throw new ForbiddenException("You are not a member of this organisation");
    }
  }
}
