import { TokenService } from "./../token.service";
import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { IDecodedToken } from "src/users/users.interface";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private tokenService: TokenService) {
    super({
      secretOrKey: process.env.SECRER_JWT,
      jwtFromRequest: ExtractJwt.fromHeader("token"),
    });
  }

  async validate(payload: IDecodedToken): Promise<boolean> {
    try {
      const user = await this.tokenService.getTokenByUser(payload.userId);
      return user != null;
    } catch (e) {
      throw new Error(e);
    }
  }
}
