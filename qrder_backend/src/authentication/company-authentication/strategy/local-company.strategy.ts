import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { CompanyAuthenticationService } from '../company-authentication.service';
import Company from 'src/company/entities/company.entity';

@Injectable()
export class LocalCompanyStrategy extends PassportStrategy(
  Strategy,
  'local_company',
) {
  constructor(
    private readonly companyAuthenticationService: CompanyAuthenticationService,
  ) {
    super({
      usernameField: 'email',
    });
  }
  async validate(email: string, password: string): Promise<Company> {
    return this.companyAuthenticationService.getAuthenticatedCompany(
      email,
      password,
    );
  }
}
