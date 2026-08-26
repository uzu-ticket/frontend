import { BadRequestException, Inject, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { stringify } from "csv-stringify/sync";
import { PrismaService } from "../../prisma/prisma.service";
import { AuditService } from "../../common/audit/audit.service";
import { PermissionsService } from "../../common/auth/permissions.service";
import { Permission } from "../../common/auth/permissions";
import { newId } from "../../common/id";
import { minorToMajorString } from "../../common/money";
import { TwoFactorService } from "../auth/two-factor.service";
import { WalletsService } from "../wallets/wallets.service";
import { PAYOUT_PROVIDER, PayoutProvider } from "./providers/payout-provider";
import { RequestWithdrawalDto } from "./dto/request-withdrawal.dto";

@Injectable()
export class WithdrawalsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
    private readonly permissions: PermissionsService,
    private readonly twoFactor: TwoFactorService,
    private readonly wallets: WalletsService,
    @Inject(PAYOUT_PROVIDER) private readonly payoutProvider: PayoutProvider,
  ) {}

  /**
   * PRD §3.8: Super-Admin-only (Permission.WithdrawalRequest is
   * super_admin-exclusive, see common/auth/permissions.ts), requires
   * verified KYB + 2FA. Debits the wallet and kicks off the PSP transfer in
   * the same call — a real ops flow might insert a manual review step
   * between "requested" and "processing"; this collapses them for MVP.
   */
  async requestWithdrawal(organisationId: string, userId: string, dto: RequestWithdrawalDto) {
    await this.permissions.assertPermission(userId, organisationId, Permission.WithdrawalRequest);

    const org = await this.prisma.organisation.findUniqueOrThrow({ where: { id: organisationId } });
    if (org.kybStatus !== "verified") {
      throw new BadRequestException("Organisation KYB must be verified before withdrawing funds");
    }
    if (!org.settlementBankCode || !org.settlementAccountNumber || !org.settlementAccountName) {
      throw new BadRequestException("No verified settlement account on file");
    }
    if (!(await this.twoFactor.verifyForUser(userId, dto.twoFactorCode))) {
      throw new UnauthorizedException("Invalid or missing 2FA code");
    }

    const wallet = await this.wallets.getOrCreateOrganisationWallet(organisationId);
    const amountMinor = BigInt(dto.amountMinor);
    if (amountMinor > wallet.balanceMinor) {
      throw new BadRequestException("Requested amount exceeds available wallet balance");
    }

    const withdrawal = await this.prisma.$transaction(async (tx) => {
      const created = await tx.withdrawal.create({
        data: {
          id: newId(),
          walletId: wallet.id,
          beneficiaryType: "organisation",
          organisationId,
          amountMinor,
          currency: wallet.currency,
          bankCode: org.settlementBankCode!,
          accountNumber: org.settlementAccountNumber!,
          accountName: org.settlementAccountName!,
          requestedBy: userId,
          status: "processing",
        },
      });
      await this.wallets.debitWalletForWithdrawal(wallet.id, amountMinor, created.id, wallet.currency, tx);
      await this.audit.log(
        {
          organisationId,
          actorUserId: userId,
          action: "withdrawal.requested",
          entityType: "withdrawal",
          entityId: created.id,
        },
        tx,
      );
      return created;
    });

    try {
      const { transferReference } = await this.payoutProvider.initiateTransfer({
        amountMinor,
        currency: withdrawal.currency,
        bankCode: withdrawal.bankCode,
        accountNumber: withdrawal.accountNumber,
        accountName: withdrawal.accountName,
        reason: `UzuTicket withdrawal ${withdrawal.id}`,
        reference: withdrawal.id,
      });
      return this.prisma.withdrawal.update({
        where: { id: withdrawal.id },
        data: { pspTransferReference: transferReference },
      });
    } catch (error) {
      await this.markFailed(withdrawal.id, (error as Error).message);
      throw new BadRequestException(
        "Payout provider rejected the transfer — withdrawal marked failed and funds returned",
      );
    }
  }

  /** Called by the Paystack webhook on transfer.success / transfer.failed. */
  async confirmPayout(withdrawalId: string, success: boolean, failureReason?: string): Promise<void> {
    if (success) {
      await this.prisma.$transaction(async (tx) => {
        const updateResult = await tx.withdrawal.updateMany({
          where: { id: withdrawalId, status: "processing" },
          data: { status: "paid", processedAt: new Date() },
        });
        if (updateResult.count === 0) return;
        await tx.transaction.updateMany({ where: { withdrawalId }, data: { status: "succeeded" } });
      });
    } else {
      await this.markFailed(withdrawalId, failureReason);
    }
  }

  private async markFailed(withdrawalId: string, reason?: string): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      const withdrawal = await tx.withdrawal.findUnique({ where: { id: withdrawalId } });
      if (!withdrawal || withdrawal.status === "paid" || withdrawal.status === "failed") return;

      await tx.withdrawal.update({
        where: { id: withdrawalId },
        data: { status: "failed", failureReason: reason, processedAt: new Date() },
      });
      await tx.transaction.updateMany({ where: { withdrawalId }, data: { status: "failed" } });
      // Return the funds: reverse the debit.
      await tx.wallet.update({
        where: { id: withdrawal.walletId },
        data: { balanceMinor: { increment: withdrawal.amountMinor } },
      });
    });
  }

  async listForOrg(organisationId: string, userId: string) {
    await this.permissions.assertPermission(userId, organisationId, Permission.WithdrawalView);
    return this.prisma.withdrawal.findMany({ where: { organisationId }, orderBy: { requestedAt: "desc" } });
  }

  async exportStatementCsv(organisationId: string, userId: string): Promise<string> {
    await this.permissions.assertPermission(userId, organisationId, Permission.WalletView);
    const transactions = await this.prisma.transaction.findMany({
      where: { organisationId },
      orderBy: { createdAt: "asc" },
    });
    const rows = transactions.map((t) => ({
      date: t.createdAt.toISOString(),
      type: t.transactionType,
      status: t.status,
      amount: minorToMajorString(t.amountMinor, t.currency),
      psp_reference: t.pspReference ?? "",
      description: t.description ?? "",
    }));
    return stringify(rows, { header: true });
  }

  async findOne(organisationId: string, withdrawalId: string, userId: string) {
    await this.permissions.assertPermission(userId, organisationId, Permission.WithdrawalView);
    const withdrawal = await this.prisma.withdrawal.findUnique({ where: { id: withdrawalId } });
    if (!withdrawal || withdrawal.organisationId !== organisationId)
      throw new NotFoundException("Withdrawal not found");
    return withdrawal;
  }
}
