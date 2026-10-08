import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { AppConfigService } from "../../../config/app-config.service";
import { PrismaService } from "../../../prisma/prisma.service";

export interface JwtAccessPayload {
  sub: string;
  email: string;
  sessionId?: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
  constructor(
    config: AppConfigService,
    private readonly prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.jwtAccessSecret,
    });
  }

  async validate(payload: JwtAccessPayload) {
    const user = await this.prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user || user.status !== "active") {
      throw new UnauthorizedException();
    }
    if (payload.sessionId) {
      const session = await this.prisma.userSession.findUnique({
        where: { id: payload.sessionId },
      });
      if (session?.revokedAt) {
        throw new UnauthorizedException("Session has been revoked");
      }
      // Update lastActiveAt non-blockingly
      this.prisma.userSession
        .update({
          where: { id: payload.sessionId },
          data: { lastActiveAt: new Date() },
        })
        .catch(() => {});
    }
    return { id: user.id, email: user.email, sessionId: payload.sessionId };
  }
}
