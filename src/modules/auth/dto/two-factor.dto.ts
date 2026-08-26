import { ApiProperty } from "@nestjs/swagger";
import { IsString, Length } from "class-validator";

export class TwoFactorCodeDto {
  @ApiProperty({ example: "123456", description: "6-digit TOTP code", minLength: 6, maxLength: 6 })
  @IsString()
  @Length(6, 6)
  code!: string;
}

export class EnableTwoFactorDto extends TwoFactorCodeDto {
  @ApiProperty({ description: "TOTP secret obtained from 2FA setup" })
  @IsString()
  secret!: string;
}
