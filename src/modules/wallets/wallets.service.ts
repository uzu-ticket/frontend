import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { Prisma, PspProvider, PaymentMethod, Wallet } from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service";
import { AppConfigService } from "../../config/app-config.service";
import { AuditService } from "../../common/audit/audit.service";
import { PermissionsService } from "../../common/auth/permissions.service";
import { Permission } from "../../common/auth/permissions";
import { newId } from "../../common/id";
import { bpsOf } from "../../common/money";

export interface CreditForOrderInput {
  orderId: string;
  organisationId: string;
  subtotalMinor: bigint;
  totalMinor: bigint;
  currency: string;
  /** Unset for free/RSVP orders (totalMinor 0n) — no PSP is involved. */
  pspProvider?: PspProvider;
  pspReference?: string;
  paymentMethod?: PaymentMethod;
}

@Injectable()
export class WalletsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: AppConfigService,
    private readonly audit: AuditService,
    private readonly permissions: PermissionsService,
  ) {}

  async getOrCreateOrganisationWallet(organisationId: string, tx: Prisma.TransactionClient = this.prisma): Promise<Wallet> {
    const existing = await tx.wallet.findFirst({ where: { organisationId, ownerType: "organisation" } });
    if (existing) return existing;
    return tx.wallet.create({
      data: { id: newId(), ownerType: "organisation", organisationId },
    });
  }

  async getOrCreatePromoterWallet(promoterUserId: string, tx: Prisma.TransactionClient = this.prisma): Promise<Wallet> {
    const existing = await tx.wallet.findFirst({ where: { promoterUserId, ownerType: "promoter" } });
    if (existing) return existing;
    return tx.wallet.create({
      data: { id: newId(), ownerType: "promoter", promoterUserId },
    });
  }

  /**
   * Money side of payment confirmation (integrity doc §7, PRD §3.8): credits
   * the organiser wallet with gross ticket revenue (order.subtotalMinor —
   * "gross minus platform fees" per §3.8, since the platform fee is what's
   * added on top of subtotal to reach the buyer's total). Applies a risk
   * hold for first-time organisers per the configurable default percentage.
   */
  async creditOrganisationWalletForOrder(input: CreditForOrderInput, tx: Prisma.TransactionClient): Promise<void> {
    const wallet = await this.getOrCreateOrganisationWallet(input.organisationId, tx);

    const transaction = await tx.transaction.create({
      data: {
        id: newId(),
        transactionType: "ticket_purchase",
        status: "succeeded",
        amountMinor: input.totalMinor,
        currency: input.currency,
        orderId: input.orderId,
        walletId: wallet.id,
        organisationId: input.organisationId,
        pspProvider: input.pspProvider,
        pspReference: input.pspReference,
        paymentMethod: input.paymentMethod,
        description: "Ticket purchase",
      },
    });

    const isFirstTimeOrg = (await tx.transaction.count({
      where: { organisationId: input.organisationId, transactionType: "ticket_purchase", status: "succeeded" },
    })) <= 1; // this transaction itself already counts

    const holdMinor = isFirstTimeOrg ? bpsOf(input.subtotalMinor, this.config.defaultRiskHoldPercentBps) : 0n;
    const availableMinor = input.subtotalMinor - holdMinor;

    const updatedWallet = await tx.wallet.update({
      where: { id: wallet.id },
      data: { balanceMinor: { increment: availableMinor }, heldMinor: { increment: holdMinor } },
    });

    await tx.ledgerEntry.create({
      data: {
        id: newId(),
        transactionId: transaction.id,
        walletId: wallet.id,
        entryType: "credit",
        amountMinor: input.subtotalMinor,
        balanceAfterMinor: updatedWallet.balanceMinor,
      },
    });

    if (holdMinor > 0n) {
      const order = await tx.order.findUniqueOrThrow({ where: { id: input.orderId } });
      await tx.payoutHold.create({
        data: {
          id: newId(),
          organisationId: input.organisationId,
          eventId: order.eventId,
          amountMinor: holdMinor,
          currency: input.currency,
          reason: "First-time organiser risk hold",
        },
      });
    }
  }

  /** Called by the withdrawals module once a payout has been requested and is being processed. */
  async debitWalletForWithdrawal(
    walletId: string,
    amountMinor: bigint,
    withdrawalId: string,
    currency: string,
    tx: Prisma.TransactionClient,
  ) {
    const wallet = await tx.wallet.findUniqueOrThrow({ where: { id: walletId } });
    if (wallet.balanceMinor < amountMinor) {
      throw new BadRequestException("Insufficient available wallet balance for this withdrawal");
    }

    const transaction = await tx.transaction.create({
      data: {
        id: newId(),
        transactionType: "settlement",
        status: "processing",
        amountMinor,
        currency,
        walletId,
        organisationId: wallet.organisationId,
        withdrawalId,
        description: "Withdrawal payout",
      },
    });

    const updatedWallet = await tx.wallet.update({
      where: { id: walletId },
      data: { balanceMinor: { decrement: amountMinor } },
    });

    await tx.ledgerEntry.create({
      data: {
        id: newId(),
        transactionId: transaction.id,
        walletId,
        entryType: "debit",
        amountMinor,
        balanceAfterMinor: updatedWallet.balanceMinor,
      },
    });

    return transaction;
  }

  async getBalance(organisationId: string, userId: string) {
    await this.permissions.assertPermission(userId, organisationId, Permission.WalletView);
    const wallet = await this.getOrCreateOrganisationWallet(organisationId);
    return wallet;
  }

  async getStatement(organisationId: string, userId: string) {
    await this.permissions.assertPermission(userId, organisationId, Permission.WalletView);
    return this.prisma.transaction.findMany({
      where: { organisationId },
      orderBy: { createdAt: "desc" },
      include: { ledgerEntries: true },
    });
  }

  /**
   * Full-order refund (partial/per-ticket refunds are a future extension).
   * Reverses the ticket_purchase transaction, voids the order's tickets so
   * they stop scanning valid, and debits the organiser wallet back.
   */
  async refundOrder(organisationId: string, orderId: string, actorUserId: string, reason?: string) {
    await this.permissions.assertPermission(actorUserId, organisationId, Permission.OrderRefund);

    return this.prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({ where: { id: orderId }, include: { event: true } });
      if (!order || order.event.organisationId !== organisationId) {
        throw new NotFoundException("Order not found");
      }
      if (order.status !== "paid") {
        throw new BadRequestException(`Cannot refund an order in status "${order.status}"`);
      }

      const purchaseTx = await tx.transaction.findFirst({
        where: { orderId, transactionType: "ticket_purchase", status: "succeeded" },
      });
      if (!purchaseTx) {
        throw new BadRequestException("No successful purchase transaction found for this order");
      }

      const wallet = await this.getOrCreateOrganisationWallet(organisationId, tx);
      const refundTx = await tx.transaction.create({
        data: {
          id: newId(),
          transactionType: "refund",
          status: "succeeded",
          amountMinor: order.totalMinor,
          currency: order.currency,
          orderId,
          walletId: wallet.id,
          organisationId,
          parentTransactionId: purchaseTx.id,
          description: reason ?? "Order refund",
        },
      });

      const updatedWallet = await tx.wallet.update({
        where: { id: wallet.id },
        data: { balanceMinor: { decrement: order.subtotalMinor } },
      });
      await tx.ledgerEntry.create({
        data: {
          id: newId(),
          transactionId: refundTx.id,
          walletId: wallet.id,
          entryType: "debit",
          amountMinor: order.subtotalMinor,
          balanceAfterMinor: updatedWallet.balanceMinor,
        },
      });

      await tx.ticket.updateMany({ where: { orderId, status: "valid" }, data: { status: "refunded" } });
      await tx.order.update({ where: { id: orderId }, data: { status: "refunded" } });

      await this.audit.log(
        {
          organisationId,
          actorUserId,
          action: "order.refunded",
          entityType: "order",
          entityId: orderId,
          metadata: { reason },
        },
        tx,
      );

      return refundTx;
    });
  }
}
