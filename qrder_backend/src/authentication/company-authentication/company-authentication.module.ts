import { Module } from '@nestjs/common';
import { CompanyAuthenticationService } from './company-authentication.service';
import { CompanyAuthenticationController } from './company-authentication.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { CompanyModule } from 'src/company/company.module';
import { PaymentModule } from 'src/payment/payment.module';
import { JwtCompanyStrategy } from './strategy/jwt-company.strategy';
import { LocalCompanyStrategy } from './strategy/local-company.strategy';

@Module({
  controllers: [CompanyAuthenticationController],
  providers: [
    CompanyAuthenticationService,
    LocalCompanyStrategy,
    JwtCompanyStrategy,
  ],
  imports: [
    CompanyModule,
    PaymentModule,
    ConfigModule,
    PassportModule.registerAsync({
      useFactory: async () => ({ property: 'company' }),
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_COMPANY_ACCESS_TOKEN_SECRET'),
        signOptions: {
          expiresIn: `${configService.get(
            'JWT_COMPANY_ACCESS_TOKEN_EXPIRATION_TIME',
          )}s`,
        },
      }),
    }),
  ],
})
export class CompanyAuthenticationModule {}
