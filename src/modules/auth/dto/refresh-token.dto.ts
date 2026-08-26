import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class RefreshTokenDto {
  @ApiProperty({ description: "Valid refresh token to exchange for new token pair" })
  @IsString()
  refreshToken!: string;
}
