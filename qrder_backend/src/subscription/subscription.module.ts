import { Module } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { SubscriptionController } from './subscription.controller';
import { CompanyModule } from 'src/company/company.module';
import { PaymentModule } from 'src/payment/payment.module';
import { PassportModule } from '@nestjs/passport';
import { TaskModule } from 'src/task/task.module';

@Module({
  imports: [
    CompanyModule,
    PaymentModule,
    TaskModule,
    PassportModule.registerAsync({
      useFactory: async () => ({ property: 'company' }),
    }),
  ],
  providers: [SubscriptionService],
  controllers: [SubscriptionController],
  exports: [SubscriptionService],
})
export class SubscriptionModule {}
