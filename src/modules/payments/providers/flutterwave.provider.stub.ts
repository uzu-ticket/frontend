import { Injectable } from "@nestjs/common";
import { InitiatePaymentInput, InitiatePaymentResult, PaymentProvider, VerifyPaymentResult } from "./payment-provider";

/**
 * Interface stub for the dual-PSP failover described in PRD §4.1. Not
 * wired up — implement against Flutterwave's API and bind PAYMENT_PROVIDER
 * (or add a failover-selecting decorator) once a second provider is needed.
 */
@Injectable()
export class FlutterwaveProviderStub implements PaymentProvider {
  initiate(_input: InitiatePaymentInput): Promise<InitiatePaymentResult> {
    throw new Error("FlutterwaveProviderStub is not implemented");
  }

  verify(_reference: string): Promise<VerifyPaymentResult> {
    throw new Error("FlutterwaveProviderStub is not implemented");
  }
}
