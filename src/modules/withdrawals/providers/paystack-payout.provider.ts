import { Injectable } from "@nestjs/common";
import axios, { AxiosInstance } from "axios";
import { AppConfigService } from "../../../config/app-config.service";
import { InitiateTransferInput, InitiateTransferResult, PayoutProvider } from "./payout-provider";

interface RecipientResponse {
  status: boolean;
  data: { recipient_code: string };
}
interface TransferResponse {
  status: boolean;
  data: { reference: string; transfer_code: string };
}

@Injectable()
export class PaystackPayoutProvider implements PayoutProvider {
  private readonly http: AxiosInstance;

  constructor(private readonly config: AppConfigService) {
    this.http = axios.create({
      baseURL: "https://api.paystack.co",
      headers: { Authorization: `Bearer ${this.config.paystackSecretKey}` },
    });
  }

  async initiateTransfer(input: InitiateTransferInput): Promise<InitiateTransferResult> {
    const recipient = await this.http.post<RecipientResponse>("/transferrecipient", {
      type: "nuban",
      name: input.accountName,
      account_number: input.accountNumber,
      bank_code: input.bankCode,
      currency: input.currency,
    });

    const transfer = await this.http.post<TransferResponse>("/transfer", {
      source: "balance",
      amount: Number(input.amountMinor),
      currency: input.currency,
      reference: input.reference,
      recipient: recipient.data.data.recipient_code,
      reason: input.reason,
    });

    return { transferReference: transfer.data.data.reference };
  }
}
