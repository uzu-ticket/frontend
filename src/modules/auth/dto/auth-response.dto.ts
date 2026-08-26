import { ApiProperty } from "@nestjs/swagger";

export class TokenPairResponse {
  @ApiProperty({ description: "JWT access token (15-minute TTL)" })
  accessToken!: string;

  @ApiProperty({ description: "JWT refresh token (30-day TTL)" })
  refreshToken!: string;
}

export class MessageResponse {
  @ApiProperty({ example: "Operation successful" })
  message!: string;
}

export class TwoFactorSetupResponse {
  @ApiProperty({ description: "TOTP secret to enter into authenticator app" })
  secret!: string;

  @ApiProperty({ description: "OTPAuth URL for QR code generation" })
  otpauthUrl!: string;
}

export class TwoFactorStatusResponse {
  @ApiProperty({ description: "Whether 2FA is now enabled or disabled" })
  enabled!: boolean;
}
