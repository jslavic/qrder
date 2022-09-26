import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import TokenPayload from '../interface/tokenPayload.interface';
import { CompanyService } from 'src/company/company.service';
import { Request } from 'express';

@Injectable()
export class JwtCompanyStrategy extends PassportStrategy(
  Strategy,
  'jwt_company',
) {
  constructor(
    private readonly configService: ConfigService,
    private readonly companyService: CompanyService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.Authorization;
        },
      ]),
      ignoreExpiration: true,
      secretOrKey: configService.get('JWT_COMPANY_ACCESS_TOKEN_SECRET'),
      property: 'company',
    });
  }

  async validate(tokenPayload: TokenPayload) {
    const company = await this.companyService.findById(
      tokenPayload.sub.companyId,
    );
    if (!company)
      throw new UnauthorizedException(
        'You are not authorized to make that request',
      );
    if (company.password !== tokenPayload.sub.hashedPassword)
      throw new UnauthorizedException(
        'You are not authorized to make that request',
      );
    return company;
  }
}
