/**
 * All money in this codebase is integer minor units (kobo for NGN), stored
 * as Postgres bigint / JS BigInt, per uzuticket-schema.dbml's design notes.
 * Never do money arithmetic in `number` — precision loss is a real bug here.
 */

export function bpsOf(amountMinor: bigint, bps: number): bigint {
  // bps = basis points (1/100th of a percent); 500 bps = 5%.
  return (amountMinor * BigInt(bps)) / 10_000n;
}

export interface PlatformFeeBreakdown {
  subtotalMinor: bigint;
  platformFeeMinor: bigint;
  totalMinor: bigint;
}

/**
 * Platform fee = percentage of subtotal + a fixed fee per order, per the
 * DBML's note on orders.platform_fee_minor ("5% + fixed fee").
 */
export function calculatePlatformFee(
  subtotalMinor: bigint,
  feePercentBps: number,
  feeFixedMinor: bigint,
): PlatformFeeBreakdown {
  if (subtotalMinor === 0n) {
    return { subtotalMinor, platformFeeMinor: 0n, totalMinor: 0n };
  }
  const platformFeeMinor = bpsOf(subtotalMinor, feePercentBps) + feeFixedMinor;
  return {
    subtotalMinor,
    platformFeeMinor,
    totalMinor: subtotalMinor + platformFeeMinor,
  };
}

export function minorToMajorString(amountMinor: bigint, currency = "NGN"): string {
  const negative = amountMinor < 0n;
  const abs = negative ? -amountMinor : amountMinor;
  const major = abs / 100n;
  const minor = abs % 100n;
  const sign = negative ? "-" : "";
  return `${sign}${currency} ${major}.${minor.toString().padStart(2, "0")}`;
}
