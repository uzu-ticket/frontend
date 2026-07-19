import { Permission, permissionsForRole } from "./permissions";

describe("permissionsForRole", () => {
  it("grants super_admin every permission", () => {
    const superAdminPermissions = permissionsForRole("super_admin");
    for (const permission of Object.values(Permission)) {
      expect(superAdminPermissions).toContain(permission);
    }
  });

  it("restricts role management, bank details, and org deletion to super_admin only", () => {
    // PRD §3.1: "Only Super Admin can: manage roles, change bank details,
    // initiate withdrawals, delete the organisation."
    const restricted = [
      Permission.OrgManageRoles,
      Permission.OrgManageBankDetails,
      Permission.OrgDelete,
      Permission.OrgSubmitKyb,
      Permission.WithdrawalRequest,
    ];
    for (const role of ["admin", "sales", "customer_support", "ticket_scanner", "promoter"] as const) {
      const granted = permissionsForRole(role);
      for (const permission of restricted) {
        expect(granted).not.toContain(permission);
      }
    }
  });

  it("scopes ticket_scanner to scanning only", () => {
    expect(permissionsForRole("ticket_scanner")).toEqual([Permission.ScannerScan]);
  });

  it("grants promoter no dashboard permissions", () => {
    expect(permissionsForRole("promoter")).toEqual([]);
  });

  it("lets admin manage events and resend tickets but not organisation settings", () => {
    const adminPermissions = permissionsForRole("admin");
    expect(adminPermissions).toContain(Permission.EventPublish);
    expect(adminPermissions).toContain(Permission.OrderResendTicket);
    expect(adminPermissions).not.toContain(Permission.OrgManageRoles);
  });
});
