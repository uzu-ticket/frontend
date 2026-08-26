import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, Length } from "class-validator";

export class RequestEmailVerificationDto {
  @ApiProperty({ example: "user@example.com", description: "Email address to verify" })
  @IsEmail()
  email!: string;
}

export class VerifyEmailDto {
  @ApiProperty({ example: "user@example.com", description: "Email address to verify" })
  @IsEmail()
  email!: string;

  @ApiProperty({
    example: "abc123def",
    description: "Verification token received via email",
    minLength: 6,
    maxLength: 100,
  })
  @IsString()
  @Length(6, 100)
  token!: string;
}
