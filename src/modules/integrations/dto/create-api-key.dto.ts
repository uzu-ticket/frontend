import { IsArray, IsIn, IsOptional, IsString } from "class-validator";

export class CreateApiKeyDto {
  @IsString()
  label: string;

  @IsOptional()
  @IsIn(["Live (Production)", "Test (Sand hook)", "live", "test"])
  environment?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  permissions?: string[];
}
