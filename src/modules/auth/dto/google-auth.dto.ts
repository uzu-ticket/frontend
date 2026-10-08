import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class GoogleCallbackDto {
  @ApiProperty({
    description: "The authorization code returned by Google OAuth",
    example: "4/0AeanS0Y...",
  })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiPropertyOptional({
    description: "The redirect URI used when requesting the authorization code",
    example: "http://localhost:3000/auth/callback/google",
  })
  @IsString()
  @IsOptional()
  redirectUri?: string;
}
