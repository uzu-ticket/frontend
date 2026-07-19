import { Injectable } from "@nestjs/common";
import { authenticator } from "otplib";
import { PrismaService } from "../../prisma/prisma.service";

/**
 * TOTP-based 2FA gating withdrawal initiation (PRD §3.8 "2FA required").
 * Not modeled in the original DBML — see User.totpSecret in schema.prisma.
 */
@Injectable()
export class TwoFactorService {
  constructor(private readonly prisma: PrismaService) {}

  generateSecret(email: string): { secret: string; otpauthUrl: string } {
    const secret = authenticator.generateSecret();
    const otpauthUrl = authenticator.keyuri(email, "UzuTicket", secret);
    return { secret, otpauthUrl };
  }

  async enable(userId: string, secret: string, code: string): Promise<boolean> {
    if (!authenticator.verify({ token: code, secret })) {
      return false;
    }
    await this.prisma.user.update({
      where: { id: userId },
      data: { totpSecret: secret, isTotpEnabled: true },
    });
    return true;
  }

  async disable(userId: string, code: string): Promise<boolean> {
    const user = await this.prisma.user.findUniqueOrThrow({ where: { id: userId } });
    if (!user.totpSecret || !authenticator.verify({ token: code, secret: user.totpSecret })) {
      return false;
    }
    await this.prisma.user.update({
      where: { id: userId },
      data: { totpSecret: null, isTotpEnabled: false },
    });
    return true;
  }

  /** Used by the withdrawals module to gate a request. */
  async verifyForUser(userId: string, code: string): Promise<boolean> {
    const user = await this.prisma.user.findUniqueOrThrow({ where: { id: userId } });
    if (!user.isTotpEnabled || !user.totpSecret) {
      return false;
    }
    return authenticator.verify({ token: code, secret: user.totpSecret });
  }
}
