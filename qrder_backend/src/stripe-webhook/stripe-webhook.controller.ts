import {
  BadRequestException,
  Controller,
  Headers,
  Post,
  Req,
} from '@nestjs/common';
import RequestWithRawBody from 'src/common/interface/requestWithRawBody.interface';
import Stripe from 'stripe';
import StripeInvoice from './interface/stripeInvoice';
import { StripeWebhookService } from './stripe-webhook.service';

@Controller('stripe-webhooks')
export class StripeWebhookController {
  constructor(private readonly stripeWebhookService: StripeWebhookService) {}

  @Post()
  async handleWebhookEvents(
    @Headers('stripe-signature') signature: string,
    @Req() request: RequestWithRawBody,
  ) {
    if (!signature)
      throw new BadRequestException('No stripe signature provided');

    const event = await this.stripeWebhookService.getEvent(
      signature,
      request.rawBody,
    );

    try {
      switch (event.type) {
        case 'invoice.paid':
          const invoiceObject = event.data.object as StripeInvoice;
          await this.stripeWebhookService.handleInvoicePaid(
            invoiceObject.customer,
          );
          break;
        case 'payment_intent.succeeded':
          const intentObject = event.data.object as Stripe.PaymentIntent;
          await this.stripeWebhookService.handlePaidPaymentItent(intentObject);
          break;
        case 'account.updated':
          const accountObject = event.data.object as Stripe.Account;
          await this.stripeWebhookService.handleAccountUpdate(accountObject);
      }
    } catch (err) {
      console.log('WEBHOOK ERROR: ', err);
    }
    return { message: 'recieved' };
  }
}
