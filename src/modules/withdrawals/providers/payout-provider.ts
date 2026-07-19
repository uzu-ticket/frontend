export const PAYOUT_PROVIDER = "PAYOUT_PROVIDER";

export interface InitiateTransferInput {
  amountMinor: bigint;
  currency: string;
  bankCode: string;
  accountNumber: string;
  accountName: string;
  reason: string;
  reference: string; // withdrawal.id
}

export interface InitiateTransferResult {
  transferReference: string;
}

/** Extends the dual-PSP abstraction (payments module) to outbound payouts. */
export interface PayoutProvider {
  initiateTransfer(input: InitiateTransferInput): Promise<InitiateTransferResult>;
}
