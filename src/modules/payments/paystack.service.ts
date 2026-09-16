import { BadGatewayException, Injectable } from "@nestjs/common";
import axios, { AxiosInstance } from "axios";
import { AppConfigService } from "../../config/app-config.service";

export interface PaystackBank {
  name: string;
  code: string;
  slug: string;
  longcode: string;
  active: boolean;
  country: string;
  currency: string;
  type: string;
}

interface PaystackBanksResponse {
  status: boolean;
  message: string;
  data: PaystackBank[];
}

interface PaystackResolveResponse {
  status: boolean;
  message: string;
  data: {
    account_number: string;
    account_name: string;
    bank_id: number;
  };
}

@Injectable()
export class PaystackService {
  private readonly http: AxiosInstance;

  constructor(config: AppConfigService) {
    this.http = axios.create({
      baseURL: "https://api.paystack.co",
      headers: {
        Authorization: `Bearer ${config.paystackSecretKey}`,
        Accept: "application/json",
      },
      timeout: 10_000,
    });
  }

  async listBanks(): Promise<PaystackBank[]> {
    try {
      const { data } = await this.http.get<PaystackBanksResponse>("/bank", {
        params: { country: "nigeria", perPage: 100 },
      });
      return data.data.filter((bank) => bank.active);
    } catch {
      throw new BadGatewayException("Unable to retrieve the bank list right now. Please try again.");
    }
  }

  async resolveAccount(accountNumber: string, bankCode: string) {
    try {
      const { data } = await this.http.get<PaystackResolveResponse>("/bank/resolve", {
        params: {
          account_number: accountNumber,
          bank_code: bankCode,
        },
      });
      return {
        accountNumber: data.data.account_number,
        accountName: data.data.account_name,
        bankId: data.data.bank_id,
      };
    } catch {
      throw new BadGatewayException("We could not verify this bank account. Check the details and try again.");
    }
  }
}
