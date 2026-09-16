import { Controller, Get, Query } from "@nestjs/common";
import { IsString, Length } from "class-validator";
import { ApiTags } from "@nestjs/swagger";
import { PaystackService } from "./paystack.service";

class ResolveAccountQueryDto {
  @IsString()
  @Length(10, 10)
  accountNumber!: string;

  @IsString()
  @Length(2, 10)
  bankCode!: string;
}

@ApiTags("paystack")
@Controller("payments/paystack")
export class PaystackController {
  constructor(private readonly paystack: PaystackService) {}

  @Get("banks")
  listBanks() {
    return this.paystack.listBanks();
  }

  @Get("resolve-account")
  resolveAccount(@Query() query: ResolveAccountQueryDto) {
    return this.paystack.resolveAccount(query.accountNumber, query.bankCode);
  }
}
