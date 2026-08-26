import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString } from "class-validator";

export class LoginDto {
  @ApiProperty({ example: "user@example.com", description: "User's email address" })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: "securePassword123", description: "User's password" })
  @IsString()
  password!: string;
}
