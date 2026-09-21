import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  NotImplementedException,
  Param,
  Post,
  UnauthorizedException,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger";
import { Public } from "../../common/decorators/public.decorator";
import { CurrentUser, AuthenticatedUser } from "../../common/decorators/current-user.decorator";
import { AuthService } from "./auth.service";
import { TwoFactorService } from "./two-factor.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { RefreshTokenDto } from "./dto/refresh-token.dto";
import { RequestOtpDto, VerifyOtpDto } from "./dto/otp.dto";
import { EnableTwoFactorDto, TwoFactorCodeDto } from "./dto/two-factor.dto";
import { ForgotPasswordDto, ResetPasswordDto } from "./dto/password.dto";
import { RequestEmailVerificationDto, VerifyEmailDto } from "./dto/email-verification.dto";
import { TokenPairResponse, TwoFactorSetupResponse, TwoFactorStatusResponse } from "./dto/auth-response.dto";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly twoFactorService: TwoFactorService,
  ) {}

  @Public()
  @Post("register")
  @ApiOperation({
    summary: "Register new account",
    description:
      "Create a new user account with email and password. Returns a token pair for immediate authentication.",
  })
  @ApiResponse({ status: 201, description: "Account created successfully", type: TokenPairResponse })
  @ApiResponse({ status: 409, description: "An account with this email already exists" })
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto.email, dto.password, dto.fullName, dto.phone);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post("login")
  @ApiOperation({
    summary: "Email/password login",
    description: "Authenticate with email and password. Returns a token pair.",
  })
  @ApiResponse({ status: 200, description: "Login successful", type: TokenPairResponse })
  @ApiResponse({ status: 401, description: "Invalid credentials or account not active" })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto.email, dto.password);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post("refresh")
  @ApiOperation({
    summary: "Refresh access token",
    description: "Exchange a valid refresh token for a new token pair.",
  })
  @ApiResponse({ status: 200, description: "Token pair refreshed successfully", type: TokenPairResponse })
  @ApiResponse({ status: 401, description: "Invalid refresh token" })
  refresh(@Body() dto: RefreshTokenDto) {
    return this.authService.refresh(dto.refreshToken);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post("otp/request")
  @ApiOperation({
    summary: "Request email OTP",
    description: "Send a 6-digit OTP code to the specified email for passwordless login.",
  })
  @ApiResponse({ status: 200, description: "OTP sent successfully" })
  async requestOtp(@Body() dto: RequestOtpDto) {
    await this.authService.requestOtp(dto.email);
    return { message: "Verification code sent" };
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post("otp/verify")
  @ApiOperation({
    summary: "Verify OTP and log in",
    description: "Verify the OTP code and authenticate. Creates a new account if the email is not registered.",
  })
  @ApiResponse({ status: 200, description: "OTP verified and authenticated", type: TokenPairResponse })
  @ApiResponse({ status: 401, description: "Invalid or expired code" })
  verifyOtp(@Body() dto: VerifyOtpDto) {
    return this.authService.verifyOtpAndLogin(dto.email, dto.code);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post("password/forgot")
  @ApiOperation({
    summary: "Request password reset",
    description: "Send password reset instructions via email (link) or SMS (code).",
  })
  @ApiResponse({ status: 200, description: "Reset instructions sent if account exists" })
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    const channel = dto.email ? "email" : "phone";
    const contact = dto.email ?? dto.phone;
    if (!contact) {
      throw new UnauthorizedException("Email or phone is required");
    }
    const result = await this.authService.requestPasswordReset(contact, channel);
    const response: { message: string; devToken?: string } = {
      message: "If an account exists, reset instructions have been sent",
    };
    if (process.env.NODE_ENV !== "production") {
      const token = result.token ?? result.code;
      if (token) response.devToken = token;
    }
    return response;
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post("password/reset")
  @ApiOperation({
    summary: "Reset password",
    description: "Reset password using the token or code received via email or SMS.",
  })
  @ApiResponse({ status: 200, description: "Password reset successful" })
  @ApiResponse({ status: 401, description: "Invalid or expired token/code" })
  async resetPassword(@Body() dto: ResetPasswordDto) {
    const channel = dto.email ? "email" : "phone";
    const contact = dto.email ?? dto.phone;
    if (!contact || !dto.tokenOrCode) {
      throw new UnauthorizedException("Contact and token/code are required");
    }
    await this.authService.resetPassword(contact, channel, dto.tokenOrCode, dto.password);
    return { message: "Password reset successful" };
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post("verify-email/request")
  @ApiOperation({
    summary: "Request email verification",
    description: "Send a verification link to the specified email address.",
  })
  @ApiResponse({ status: 200, description: "Verification email sent if account exists and is unverified" })
  async requestEmailVerification(@Body() dto: RequestEmailVerificationDto) {
    const result = await this.authService.requestEmailVerification(dto.email);
    const response: { message: string; devLink?: string } = {
      message: "If an unverified account exists, a verification email has been sent",
    };
    if (process.env.NODE_ENV !== "production" && result?.link) {
      response.devLink = result.link;
    }
    return response;
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post("verify-email/verify")
  @ApiOperation({
    summary: "Verify email address",
    description: "Verify email using the token received via email link.",
  })
  @ApiResponse({ status: 200, description: "Email verified successfully" })
  @ApiResponse({ status: 401, description: "Invalid or expired verification token" })
  async verifyEmail(@Body() dto: VerifyEmailDto) {
    await this.authService.verifyEmail(dto.email, dto.token);
    return { message: "Email verified successfully" };
  }

  @Public()
  @Post("social/:provider")
  @ApiOperation({
    summary: "Social login (stub)",
    description: "Social login via OAuth provider. Not yet implemented.",
  })
  @ApiResponse({ status: 501, description: "Social login is not yet implemented for this provider" })
  socialLogin(@Param("provider") _provider: string) {
    throw new NotImplementedException("Social login is not yet implemented for this provider");
  }

  @HttpCode(HttpStatus.OK)
  @Post("2fa/setup")
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Setup 2FA",
    description:
      "Generate a TOTP secret for two-factor authentication setup. Returns the secret and OTPAuth URL for QR code generation.",
  })
  @ApiResponse({ status: 200, description: "2FA secret generated", type: TwoFactorSetupResponse })
  setupTwoFactor(@CurrentUser() user: AuthenticatedUser) {
    return this.twoFactorService.generateSecret(user.email);
  }

  @HttpCode(HttpStatus.OK)
  @Post("2fa/enable")
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Enable 2FA",
    description: "Enable two-factor authentication using the secret from setup and a valid TOTP code.",
  })
  @ApiResponse({ status: 200, description: "2FA enabled successfully", type: TwoFactorStatusResponse })
  @ApiResponse({ status: 401, description: "Invalid TOTP code" })
  async enableTwoFactor(@CurrentUser() user: AuthenticatedUser, @Body() body: EnableTwoFactorDto) {
    const ok = await this.twoFactorService.enable(user.id, body.secret, body.code);
    if (!ok) throw new UnauthorizedException("Invalid code");
    return { enabled: true };
  }

  @HttpCode(HttpStatus.OK)
  @Post("2fa/disable")
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Disable 2FA",
    description: "Disable two-factor authentication. Requires a valid TOTP code.",
  })
  @ApiResponse({ status: 200, description: "2FA disabled successfully", type: TwoFactorStatusResponse })
  @ApiResponse({ status: 401, description: "Invalid TOTP code" })
  async disableTwoFactor(@CurrentUser() user: AuthenticatedUser, @Body() dto: TwoFactorCodeDto) {
    const ok = await this.twoFactorService.disable(user.id, dto.code);
    if (!ok) throw new UnauthorizedException("Invalid code");
    return { enabled: false };
  }
}
