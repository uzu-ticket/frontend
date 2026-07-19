import { Body, Controller, HttpCode, HttpStatus, NotImplementedException, Param, Post, UnauthorizedException } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Public } from "../../common/decorators/public.decorator";
import { CurrentUser, AuthenticatedUser } from "../../common/decorators/current-user.decorator";
import { AuthService } from "./auth.service";
import { TwoFactorService } from "./two-factor.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { RefreshTokenDto } from "./dto/refresh-token.dto";
import { RequestOtpDto, VerifyOtpDto } from "./dto/otp.dto";
import { EnableTwoFactorDto, TwoFactorCodeDto } from "./dto/two-factor.dto";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly twoFactorService: TwoFactorService,
  ) {}

  @Public()
  @Post("register")
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto.email, dto.password, dto.fullName);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post("login")
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto.email, dto.password);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post("refresh")
  refresh(@Body() dto: RefreshTokenDto) {
    return this.authService.refresh(dto.refreshToken);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post("otp/request")
  async requestOtp(@Body() dto: RequestOtpDto) {
    await this.authService.requestOtp(dto.email);
    return { message: "Verification code sent" };
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post("otp/verify")
  verifyOtp(@Body() dto: VerifyOtpDto) {
    return this.authService.verifyOtpAndLogin(dto.email, dto.code);
  }

  /** Social login is an interface stub — no OAuth provider wired yet (PRD §3.4 "social login optional"). */
  @Public()
  @Post("social/:provider")
  socialLogin(@Param("provider") _provider: string) {
    throw new NotImplementedException("Social login is not yet implemented for this provider");
  }

  @HttpCode(HttpStatus.OK)
  @Post("2fa/setup")
  setupTwoFactor(@CurrentUser() user: AuthenticatedUser) {
    return this.twoFactorService.generateSecret(user.email);
  }

  @HttpCode(HttpStatus.OK)
  @Post("2fa/enable")
  async enableTwoFactor(@CurrentUser() user: AuthenticatedUser, @Body() body: EnableTwoFactorDto) {
    const ok = await this.twoFactorService.enable(user.id, body.secret, body.code);
    if (!ok) throw new UnauthorizedException("Invalid code");
    return { enabled: true };
  }

  @HttpCode(HttpStatus.OK)
  @Post("2fa/disable")
  async disableTwoFactor(@CurrentUser() user: AuthenticatedUser, @Body() dto: TwoFactorCodeDto) {
    const ok = await this.twoFactorService.disable(user.id, dto.code);
    if (!ok) throw new UnauthorizedException("Invalid code");
    return { enabled: false };
  }
}
