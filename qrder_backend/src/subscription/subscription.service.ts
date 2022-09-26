import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CompanyService } from 'src/company/company.service';
import { PaymentService } from 'src/payment/payment.service';
import Company from 'src/company/entities/company.entity';
import { TaskService } from 'src/task/task.service';
import { CreateSubscriptionDtoV2 } from './dto/create-subscription.dto';

@Injectable()
export class SubscriptionService {
  constructor(
    private readonly companyService: CompanyService,
    private readonly paymentService: PaymentService,
    private readonly taskService: TaskService,
  ) {}

  async getSubscription(company: Company) {
    const subscription = await this.paymentService.getSubscription(
      company.customerId,
      true,
      false,
    );
    if (subscription === null) return { subscription: null };
    const paymentMethod = await this.paymentService.getPaymentMethod(
      subscription.default_payment_method,
    );
    return { subscription, paymentMethod };
  }

  async createSubscription(company: Company, paymentMethodId: string) {
    const paymentMethod = await this.paymentService.createPaymentMethod(
      paymentMethodId,
      company.customerId,
    );
    const subscription = await this.paymentService.createSubscription(
      company.subscriptionPlan,
      paymentMethod,
      company.customerId,
    );
    return subscription;
  }

  async createSubscriptionV2(
    customerId: string,
    createSubscriptionDto: CreateSubscriptionDtoV2,
  ) {
    return await this.paymentService.createSubscriptionV2(
      customerId,
      createSubscriptionDto.paymentMethodId,
      createSubscriptionDto.priceLookupKey,
    );
  }

  async changePaymentMethod(setupIntentId: string, customerId: string) {
    return await this.paymentService.changePaymentMethod(
      setupIntentId,
      customerId,
    );
  }

  async cancelSubscription(customerId: string) {
    return await this.paymentService.cancelSubscription(customerId);
  }

  async resumeSubscription(customerId: string) {
    return await this.paymentService.resumeSubscription(customerId);
  }

  /**
   * Activate the subscription of a company that will last 33 days from now, after 33 days the status of the subscription will be checked and if still active, will be extended again, we allow our customers a 3 day period to renew their subscription successfully, only if that fails we mark the subscription as inactive
   * @param companyId The id od the company whose subscription should be activated
   * @param customerId The id of the customer that is registered on stripe
   */
  async extendSubscription(companyId: number, customerId: string) {
    try {
      const invoiceEndTime = await this.paymentService.getSubscriptionEndDate(
        customerId,
      );
      const extendedTime = invoiceEndTime + 86400000; // add one day
      const company = await this.companyService.extendCompanySubscription(
        companyId,
        extendedTime,
      );
      this.taskService.scheduleSubscriptionExpiryCheck(company);
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Error activating the company subscription',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
