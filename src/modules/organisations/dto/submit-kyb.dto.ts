import { Transform } from "class-transformer";
import { IsString, Matches, MinLength } from "class-validator";
import { CAC_NUMBER_PATTERN, normalizeCacNumber } from "../../../common/cac/cac-number";

export class SubmitKybDto {
  @IsString()
  @MinLength(4)
  @Matches(CAC_NUMBER_PATTERN, { message: "CAC number must start with RC, BN, or IT and contain 4 to 8 digits." })
  @Transform(({ value }) => (typeof value === "string" ? normalizeCacNumber(value) : value))
  cacNumber!: string;

  @IsString()
  settlementBankCode!: string;

  @IsString()
  settlementAccountNumber!: string;

  @IsString()
  settlementAccountName!: string;
}
