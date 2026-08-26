import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsOptional, IsString, MinLength } from "class-validator";

export class RegisterDto {
  @ApiProperty({ example: "user@example.com", description: "User's email address" })
  @IsEmail()
  email!: string;

  @ApiPropertyOptional({ example: "+2348012345678", description: "User's phone number" })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ example: "securePassword123", description: "Password (minimum 8 characters)" })
  @IsString()
  @MinLength(8)
  password!: string;

  @ApiPropertyOptional({ example: "John Doe", description: "User's full name" })
  @IsOptional()
  @IsString()
  fullName?: string;
}
