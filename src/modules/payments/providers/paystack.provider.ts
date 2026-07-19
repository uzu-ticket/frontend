import { Injectable } from "@nestjs/common";
import axios, { AxiosInstance } from "axios";
import { AppConfigService } from "../../../config/app-config.service";
import { InitiatePaymentInput, InitiatePaymentResult, PaymentProvider, VerifyPaymentResult } from "./payment-provider";

interface PaystackInitializeResponse {
  status: boolean;
  data: { authorization_url: string; access_code: string; reference: string };
}

interface PaystackVerifyResponse {
  status: boolean;
  data: {
    status: "success" | "failed" | "abandoned";
    amount: number;
    currency: string;
    channel: string;
  };
}

@Injectable()
export class PaystackProvider implements PaymentProvider {
  private readonly http: AxiosInstance;

  constructor(private readonly config: AppConfigService) {
    this.http = axios.create({
      baseURL: "https://api.paystack.co",
      headers: { Authorization: `Bearer ${this.config.paystackSecretKey}` },
    });
  }

  async initiate(input: InitiatePaymentInput): Promise<InitiatePaymentResult> {
    const { data } = await this.http.post<PaystackInitializeResponse>("/transaction/initialize", {
      email: input.email,
      amount: Number(input.amountMinor), // Paystack amount is already minor units (kobo) for NGN
      currency: input.currency,
      reference: input.reference,
    });
    return { authorizationUrl: data.data.authorization_url, reference: data.data.reference };
  }

  async verify(reference: string): Promise<VerifyPaymentResult> {
    const { data } = await this.http.get<PaystackVerifyResponse>(`/transaction/verify/${encodeURIComponent(reference)}`);
    const status = data.data.status === "success" ? "success" : data.data.status === "abandoned" ? "pending" : "failed";
    return {
      status,
      amountMinor: BigInt(data.data.amount),
      currency: data.data.currency,
      paymentMethod: this.mapChannel(data.data.channel),
    };
  }

  private mapChannel(channel: string): "card" | "bank_transfer" | "ussd" | undefined {
    if (channel === "card") return "card";
    if (channel === "bank_transfer") return "bank_transfer";
    if (channel === "ussd") return "ussd";
    return undefined;
  }
}
