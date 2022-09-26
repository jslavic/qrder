import { Module } from '@nestjs/common';
import { CompanyAuthenticationModule } from './company-authentication/company-authentication.module';
import { UserAuthenticationModule } from './user-authentication/user-authentication.module';

@Module({
  controllers: [],
  providers: [],
  imports: [CompanyAuthenticationModule, UserAuthenticationModule],
})
export class AuthenticationModule {}
