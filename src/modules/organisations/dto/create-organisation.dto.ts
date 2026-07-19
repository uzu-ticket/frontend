import { IsEmail, IsOptional, IsString, MinLength } from "class-validator";

export class CreateOrganisationDto {
  @IsString()
  @MinLength(2)
  name!: string;

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
}
