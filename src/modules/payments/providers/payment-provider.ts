export const PAYMENT_PROVIDER = "PAYMENT_PROVIDER";

export interface InitiatePaymentInput {
  reference: string; // we pass order.id so PSP <-> order mapping needs no extra state
  amountMinor: bigint;
  currency: string;
  email: string;
}

export interface InitiatePaymentResult {
  authorizationUrl: string;
  reference: string;
}

export interface VerifyPaymentResult {
  status: "success" | "failed" | "pending";
  amountMinor: bigint;
  currency: string;
  paymentMethod?: "card" | "bank_transfer" | "ussd";
}

/**
 * Dual-PSP abstraction (PRD §4.1). PaystackProvider is the concrete
 * implementation built now; FlutterwaveProvider is an interface stub so
 * failover can be added later without touching call sites.
 */
export interface PaymentProvider {
  initiate(input: InitiatePaymentInput): Promise<InitiatePaymentResult>;
  verify(reference: string): Promise<VerifyPaymentResult>;
}
