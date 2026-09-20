import { Type } from "class-transformer";
import { IsInt, IsPositive, IsString, Length } from "class-validator";

export class RequestWithdrawalDto {
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  amountMinor!: number;

  /** PRD §3.8: "2FA required." See auth module's TwoFactorService. */
  @IsString()
  @Length(6, 6)
  twoFactorCode!: string;

  @IsString()
  @Length(2, 10)
  bankCode!: string;

  @IsString()
  @Length(10, 10)
  accountNumber!: string;

  @IsString()
  @Length(2, 120)
  accountName!: string;
}
