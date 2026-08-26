import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsEnum, IsOptional, IsPhoneNumber, IsString, Length, MinLength } from "class-validator";

export class ForgotPasswordDto {
  @ApiPropertyOptional({ example: "user@example.com", description: "Email address (required if channel is email)" })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: "+2348012345678", description: "Phone number (required if channel is phone)" })
  @IsOptional()
  @IsString()
  @IsPhoneNumber("NG")
  phone?: string;

  @ApiProperty({ enum: ["email", "phone"], description: "Delivery channel for reset instructions" })
  @IsEnum(["email", "phone"])
  channel!: "email" | "phone";
}

export class ResetPasswordDto {
  @ApiPropertyOptional({ example: "user@example.com", description: "Email address (required if channel is email)" })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: "+2348012345678", description: "Phone number (required if channel is phone)" })
  @IsOptional()
  @IsString()
  @IsPhoneNumber("NG")
  phone?: string;

  @ApiProperty({ example: "abc123", description: "Reset token (email) or 6-digit code (SMS)", minLength: 6 })
  @IsString()
  @MinLength(6)
  tokenOrCode?: string;

  @ApiProperty({
    example: "newSecurePass123",
    description: "New password (8-100 characters)",
    minLength: 8,
    maxLength: 100,
  })
  @IsString()
  @Length(8, 100)
  password!: string;
}
