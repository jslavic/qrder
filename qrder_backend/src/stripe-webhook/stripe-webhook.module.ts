import { Module } from '@nestjs/common';
import { CompanyModule } from 'src/company/company.module';
import { OrderModule } from 'src/order/order.module';
import { PaymentModule } from 'src/payment/payment.module';
import { SubscriptionModule } from 'src/subscription/subscription.module';
import { StripeWebhookController } from './stripe-webhook.controller';
import { StripeWebhookService } from './stripe-webhook.service';

@Module({
  controllers: [StripeWebhookController],
  providers: [StripeWebhookService],
  imports: [CompanyModule, PaymentModule, SubscriptionModule, OrderModule],
})
export class StripeWebhookModule {}
