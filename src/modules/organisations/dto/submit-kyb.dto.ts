import { IsString, MinLength } from "class-validator";

export class SubmitKybDto {
  @IsString()
  @MinLength(4)
  cacNumber!: string;

  @IsString()
  settlementBankCode!: string;

  @IsString()
  settlementAccountNumber!: string;

  @IsString()
  settlementAccountName!: string;
}
