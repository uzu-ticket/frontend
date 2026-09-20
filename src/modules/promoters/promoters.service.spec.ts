import { PromotersService } from "./promoters.service";

describe("PromotersService", () => {
  it("aggregates promoter earnings and event rows from the organisation data", async () => {
    const permissions = {
      assertPermission: jest.fn().mockResolvedValue(undefined),
    } as any;

    const prisma = {
      eventPromoter: {
        findMany: jest.fn().mockResolvedValue([
          {
            id: "ep-1",
            event: { id: "evt-1", title: "Summer Festival" },
            user: { fullName: "Jane Doe", email: "jane@example.com" },
            ticketType: { name: "VIP" },
            commissionType: "percentage",
            commissionValue: 10n,
            status: "active",
            commissions: [
              { amountMinor: 25000n, status: "paid" },
              { amountMinor: 30000n, status: "payable" },
              { amountMinor: 15000n, status: "accrued" },
            ],
          },
          {
            id: "ep-2",
            event: { id: "evt-2", title: "Night Expo" },
            user: { fullName: null, email: "mark@example.com" },
            ticketType: null,
            commissionType: "fixed_per_ticket",
            commissionValue: 2000n,
            status: "invited",
            commissions: [{ amountMinor: 5000n, status: "reversed" }],
          },
        ]),
      },
    } as any;

    const service = new PromotersService(prisma, permissions);

    await expect(service.getSummary("org-1", "user-1")).resolves.toEqual({
      totalCommissionEarnedMinor: 70000,
      pendingMinor: 45000,
      availableMinor: 30000,
      paidOutMinor: 25000,
    });

    await expect(service.list("org-1", "user-1")).resolves.toEqual([
      {
        id: "ep-1",
        eventId: "evt-1",
        event: "Summer Festival",
        ticketsSold: 3,
        commissionRate: "10%",
        commissionEarned: 700,
        status: "Pending",
        promoterName: "Jane Doe",
        ticketTypeName: "VIP",
      },
      {
        id: "ep-2",
        eventId: "evt-2",
        event: "Night Expo",
        ticketsSold: 1,
        commissionRate: "₦20.00/ticket",
        commissionEarned: 50,
        status: "Cancelled",
        promoterName: "mark@example.com",
        ticketTypeName: "All ticket types",
      },
    ]);
  });
});
