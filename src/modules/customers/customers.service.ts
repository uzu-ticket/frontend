import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { PermissionsService } from "../../common/auth/permissions.service";
import { Permission } from "../../common/auth/permissions";

const customerSelect = {
  id: true,
  email: true,
  phone: true,
  fullName: true,
  status: true,
  city: true,
  createdAt: true,
  updatedAt: true,
  lastLoginAt: true,
} as const;

@Injectable()
export class CustomersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly permissions: PermissionsService,
  ) {}

  private async assertView(userId: string, organisationId: string) {
    await this.permissions.assertPermission(userId, organisationId, Permission.CustomerView);
  }

  private async customerIds(organisationId: string) {
    const orders = await this.prisma.order.findMany({
      where: { event: { organisationId }, buyerUserId: { not: null } },
      select: { buyerUserId: true },
      distinct: ["buyerUserId"],
    });
    return orders.flatMap((order) => (order.buyerUserId ? [order.buyerUserId] : []));
  }

  private mapCustomer(
    user: {
      id: string;
      email: string;
      phone: string | null;
      fullName: string | null;
      status: string;
      city: string | null;
      createdAt: Date;
      lastLoginAt: Date | null;
    },
    orders: number,
  ) {
    return {
      id: user.id,
      customerId: `CUST-${user.id.slice(0, 8).toUpperCase()}`,
      name: user.fullName || user.email,
      email: user.email,
      phone: user.phone ?? "",
      orders,
      status: user.status === "active" ? "Active" : "Inactive",
      location: user.city ?? "",
      customerSince: user.createdAt,
      lastActive: user.lastLoginAt,
    };
  }

  async list(organisationId: string, userId: string) {
    await this.assertView(userId, organisationId);
    const ids = await this.customerIds(organisationId);
    if (ids.length === 0) return [];

    const [users, orderCounts] = await Promise.all([
      this.prisma.user.findMany({ where: { id: { in: ids } }, select: customerSelect, orderBy: { createdAt: "desc" } }),
      this.prisma.order.groupBy({
        by: ["buyerUserId"],
        where: { event: { organisationId }, buyerUserId: { in: ids } },
        _count: { _all: true },
      }),
    ]);
    const counts = new Map(orderCounts.map((item) => [item.buyerUserId, item._count._all]));
    return users.map((user) => this.mapCustomer(user, counts.get(user.id) ?? 0));
  }

  async getStats(organisationId: string, userId: string) {
    await this.assertView(userId, organisationId);
    const customerIds = await this.customerIds(organisationId);
    const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const [active, created, used] = await Promise.all([
      this.prisma.order.findMany({
        where: { event: { organisationId }, createdAt: { gte: since }, buyerUserId: { not: null } },
        select: { buyerUserId: true },
        distinct: ["buyerUserId"],
      }),
      this.prisma.user.count({ where: { id: { in: customerIds }, createdAt: { gte: since } } }),
      this.prisma.ticket.count({ where: { event: { organisationId }, status: "used" } }),
    ]);
    return { total: customerIds.length, activeLast30Days: active.length, newLast30Days: created, duplicateUsed: used };
  }

  async findOne(organisationId: string, customerId: string, userId: string) {
    await this.assertView(userId, organisationId);
    const customer = await this.prisma.user.findFirst({
      where: { id: customerId, ordersAsBuyer: { some: { event: { organisationId } } } },
      select: customerSelect,
    });
    if (!customer) throw new NotFoundException("Customer not found");
    const orders = await this.prisma.order.findMany({
      where: { buyerUserId: customerId, event: { organisationId } },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        createdAt: true,
        status: true,
        totalMinor: true,
        currency: true,
        event: { select: { title: true } },
        _count: { select: { tickets: true } },
      },
    });
    return { ...this.mapCustomer(customer, orders.length), purchases: orders };
  }

  async setStatus(organisationId: string, customerId: string, userId: string, status: "active" | "suspended") {
    await this.permissions.assertPermission(userId, organisationId, Permission.CustomerManage);
    const customer = await this.prisma.user.findFirst({
      where: { id: customerId, ordersAsBuyer: { some: { event: { organisationId } } } },
      select: { id: true },
    });
    if (!customer) throw new NotFoundException("Customer not found");
    return this.prisma.user.update({ where: { id: customerId }, data: { status }, select: customerSelect });
  }
}
