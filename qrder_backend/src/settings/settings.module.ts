import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { CompanyModule } from 'src/company/company.module';
import { PaymentModule } from 'src/payment/payment.module';
import { SettingsController } from './settings.controller';
import { SettingsService } from './settings.service';

@Module({
  imports: [
    PassportModule.registerAsync({
      useFactory: async () => ({ property: 'company' }),
    }),
    PaymentModule,
    CompanyModule,
  ],
  controllers: [SettingsController],
  providers: [SettingsService],
})
export class SettingsModule {}
