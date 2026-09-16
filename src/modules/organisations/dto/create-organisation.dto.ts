import { Transform } from "class-transformer";
import { IsEmail, IsOptional, IsString, Matches, MinLength } from "class-validator";
import { CAC_NUMBER_PATTERN, normalizeCacNumber } from "../../../common/cac/cac-number";

export class CreateOrganisationDto {
  @IsString()
  @MinLength(2)
  name!: string;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsEmail()
  contactEmail!: string;

  @IsOptional()
  @IsString()
  contactPhone?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  logoUrl?: string;

  @IsOptional()
  @IsString()
  coverUrl?: string;

  @IsOptional()
  @IsString()
  industry?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsEmail()
  supportEmail?: string;

  @IsOptional()
  @IsString()
  supportPhone?: string;

  @IsOptional()
  @IsString()
  facebook?: string;

  @IsOptional()
  @IsString()
  twitter?: string;

  @IsOptional()
  @IsString()
  instagram?: string;

  @IsOptional()
  @IsString()
  linkedin?: string;

  @IsOptional()
  @IsString()
  registeredBusinessName?: string;

  @IsOptional()
  @IsString()
  bankName?: string;

  @IsOptional()
  @IsString()
  @Matches(CAC_NUMBER_PATTERN, { message: "CAC number must start with RC, BN, or IT and contain 4 to 8 digits." })
  @Transform(({ value }) => (typeof value === "string" ? normalizeCacNumber(value) : value))
  cacNumber?: string;

  @IsOptional()
  @IsString()
  settlementBankCode?: string;

  @IsOptional()
  @IsString()
  settlementAccountNumber?: string;

  @IsOptional()
  @IsString()
  settlementAccountName?: string;
}
