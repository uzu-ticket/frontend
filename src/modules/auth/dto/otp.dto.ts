import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, Length } from "class-validator";

export class RequestOtpDto {
  @ApiProperty({ example: "user@example.com", description: "Email address to send OTP to" })
  @IsEmail()
  email!: string;
}

export class VerifyOtpDto {
  @ApiProperty({ example: "user@example.com", description: "Email address associated with the OTP" })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: "123456", description: "6-digit OTP code", minLength: 6, maxLength: 6 })
  @IsString()
  @Length(6, 6)
  code!: string;
}
