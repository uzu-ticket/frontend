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
}
