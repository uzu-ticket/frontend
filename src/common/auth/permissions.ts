import { OrgRole } from "@prisma/client";

/**
 * Permission strings, not raw roles, are what controllers check — per PRD
 * §3.1 ("permission-based under the hood, roles as permission bundles").
 * Adding a role or reshuffling what it can do never touches a controller.
 */
export const Permission = {
  OrgManageRoles: "org.manage_roles",
  OrgManageBankDetails: "org.manage_bank_details",
  OrgEditProfile: "org.edit_profile",
  OrgDelete: "org.delete",
  OrgSubmitKyb: "org.submit_kyb",

  EventCreate: "event.create",
  EventEdit: "event.edit",
  EventPublish: "event.publish",
  EventViewDashboard: "event.view_dashboard",

  OrderView: "order.view",
  OrderResendTicket: "order.resend_ticket",
  OrderRefund: "order.refund",
  CustomerView: "customer.view",
  CustomerManage: "customer.manage",
  MarketingView: "marketing.view",
  MarketingManage: "marketing.manage",

  ScannerAssignDevice: "scanner.assign_device",
  ScannerScan: "scanner.scan",

  WalletView: "wallet.view",
  WithdrawalRequest: "withdrawal.request",
  WithdrawalView: "withdrawal.view",
} as const;

export type Permission = (typeof Permission)[keyof typeof Permission];

const ALL_PERMISSIONS = Object.values(Permission);

export const ROLE_PERMISSIONS: Record<OrgRole, Permission[]> = {
  super_admin: ALL_PERMISSIONS,
  // PRD §3.1: "Only Super Admin can: manage roles, change bank details,
  // initiate withdrawals, delete the organisation." Inviting a member
  // necessarily assigns a role, and KYB submission necessarily sets
  // settlement bank details — both stay super_admin-exclusive below.
  admin: [
    Permission.OrgEditProfile,
    Permission.EventCreate,
    Permission.EventEdit,
    Permission.EventPublish,
    Permission.EventViewDashboard,
    Permission.OrderView,
    Permission.OrderResendTicket,
    Permission.OrderRefund,
    Permission.CustomerView,
    Permission.CustomerManage,
    Permission.MarketingView,
    Permission.MarketingManage,
    Permission.ScannerAssignDevice,
    Permission.WalletView,
    Permission.WithdrawalView,
  ],
  sales: [Permission.EventViewDashboard, Permission.OrderView, Permission.OrderResendTicket, Permission.CustomerView],
  customer_support: [Permission.OrderView, Permission.OrderResendTicket, Permission.CustomerView],
  ticket_scanner: [Permission.ScannerScan],
  marketing: [Permission.EventViewDashboard, Permission.MarketingView, Permission.MarketingManage],
  promoter: [],
};

export function permissionsForRole(role: OrgRole): Permission[] {
  return ROLE_PERMISSIONS[role] ?? [];
}
