import { Injectable, NotFoundException } from '@nestjs/common';
import { StripeVerificationStatus } from 'src/common/enum/stripeVerificationStatus.enum';
import { CompanyService } from 'src/company/company.service';
import { OrderService } from 'src/order/order.service';
import { PaymentService } from 'src/payment/payment.service';
import { SubscriptionService } from 'src/subscription/subscription.service';
import Stripe from 'stripe';

@Injectable()
export class StripeWebhookService {
  constructor(
    private readonly companyService: CompanyService,
    private readonly paymentService: PaymentService,
    private readonly subscriptionService: SubscriptionService,
    private readonly orderService: OrderService,
  ) {}

  async getEvent(signature: any, rawBody: Buffer) {
    const event = await this.paymentService.constructEventFromPayload(
      signature,
      rawBody,
    );
    return event;
  }

  async handleInvoicePaid(customerId: string) {
    const company = await this.companyService.findByCustomerId(customerId);
    if (!company)
      throw new NotFoundException(
        "A company with the given customer id doesn't exist",
      );
    return await this.subscriptionService.extendSubscription(
      company.id,
      customerId,
    );
  }

  async handlePaidPaymentItent(paymentIntent: Stripe.PaymentIntent) {
    const query = paymentIntent.metadata.orderId
      ? { _id: paymentIntent.metadata.orderId }
      : { paymentIntentId: paymentIntent.id };
    return this.orderService.markOrderAsPaid(query);
  }

  async handleAccountUpdate(account: Stripe.Account) {
    console.log(account.individual.verification.status);
    return this.companyService.setCompanyVerificationStatus(
      account.id,
      account.individual.verification.status as StripeVerificationStatus,
    );
  }
}
