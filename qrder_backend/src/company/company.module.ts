import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { PaymentModule } from 'src/payment/payment.module';
import { CompanyController } from './company.controller';
import { CompanyService } from './company.service';
import Company from './entities/company.entity';
import { EmailModule } from 'src/email/email.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Company]),
    PassportModule.registerAsync({
      useFactory: async () => ({ property: 'company' }),
    }),
    ConfigModule,
    PaymentModule,
    EmailModule,
  ],
  controllers: [CompanyController],
  providers: [CompanyService],
  exports: [CompanyService],
})
export class CompanyModule {}
