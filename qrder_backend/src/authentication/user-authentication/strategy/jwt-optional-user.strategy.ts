import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import TokenPayload from '../interface/tokenPayload.interface';
import { UserService } from 'src/user/user.service';
import { Request } from 'express';

@Injectable()
export class JwtOptionalUserStrategy extends PassportStrategy(
  Strategy,
  'jwt_optional_user',
) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.Authorization;
        },
      ]),
      ignoreExpiration: true,
      secretOrKey: configService.get('JWT_USER_ACCESS_TOKEN_SECRET'),
      property: 'user',
    });
  }

  async validate(tokenPayload: TokenPayload) {
    const user = await this.userService.findById(tokenPayload.sub.userId);
    return user || null;
  }
}
