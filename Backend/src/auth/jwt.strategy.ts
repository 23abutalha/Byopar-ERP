import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      // 1. Look for the token in the 'Authorization' header as a 'Bearer' token
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'BYOPAR_MODEL_SECRET_2026_LAHORE', // Must match AuthModule!
    });
  }

  // 2. This function runs every time a user sends a token
  async validate(payload: any) {
    // If the token is valid, NestJS attaches this data to the 'request' object
    return { userId: payload.sub, email: payload.email, businessId: payload.businessId };
  }
}