import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WithdrawDto } from 'src/authentication/company-authentication/dto/withdraw.dto';
import { availableCountryInfo } from 'src/common/constants/avaiableCountryInfo';
import { AvailableCountries } from 'src/common/enum/availableCountries.enum';
import { StripeVerificationStatus } from 'src/common/enum/stripeVerificationStatus.enum';
import { AdditionalVerificationDto } from 'src/settings/dto/additional-verification.dto';
import { BankAccountDto } from 'src/settings/dto/bank-account.dto';
import { ConfirmAccountDto } from 'src/settings/dto/confirm-account.dto';
import Stripe from 'stripe';
import { SubscriptionPlans } from '../common/enum/subscriptionPlans.enum';

type ValidSubscriptionPlans = {
  [key in SubscriptionPlans]: string;
};

@Injectable()
export class PaymentService {
  private stripe: Stripe;
  private readonly subscriptionPlanIds: ValidSubscriptionPlans;

  constructor(private readonly configService: ConfigService) {
    this.stripe = new Stripe(configService.get('STRIPE_SECRET_KEY'), {
      apiVersion: '2020-08-27',
    });
    this.subscriptionPlanIds = {
      STANDARD: configService.get('STANDARD_SUBSCRIPTION_ID'),
      PREMIUM: configService.get('PREMIUM_SUBSCRIPTION_ID'),
    };
  }

  async findCustomerById(customerId: string) {
    const customer = await this.stripe.customers.retrieve(customerId);
    return customer as Stripe.Customer;
  }

  async findCustomersByEmail(email: string) {
    const customers = await this.stripe.customers.list({ email });
    return customers.data;
  }

  async createCustomer(email: string) {
    const customer = await this.stripe.customers.create({ email });
    return customer;
  }

  async deleteCustomerById(customerId: string) {
    await this.stripe.customers.del(customerId);
  }

  async createPaymentMethod(paymentMethodId: string, customerId: string) {
    try {
      const paymentMethod = await this.stripe.paymentMethods.attach(
        paymentMethodId,
        {
          customer: customerId,
        },
      );
      return paymentMethod;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error creating a payment method');
    }
  }

  async createConnectedAccount(
    businessName: string,
    email: string,
    country: AvailableCountries,
    ipAddress: string,
    businessType?: Stripe.AccountCreateParams.BusinessType,
  ) {
    return await this.stripe.accounts.create({
      business_profile: {
        name: businessName,
        mcc: '5499',
      },
      type: availableCountryInfo[country].supportedAccountType,
      country: availableCountryInfo[country].countryCode,
      email,
      default_currency: availableCountryInfo[country].currency,
      capabilities: availableCountryInfo[country].capabilities,
      business_type:
        availableCountryInfo[country].business_type ||
        businessType ||
        'individual',
      tos_acceptance: {
        ip: ipAddress,
        date: Math.round(Date.now() / 1000),
      },
    });
  }

  async createSubscription(
    priceLookupKey: SubscriptionPlans,
    paymentMethod: Stripe.Response<Stripe.PaymentMethod>,
    customerId: string,
  ) {
    const priceId = this.subscriptionPlanIds[priceLookupKey];
    try {
      const subscription = await this.stripe.subscriptions.create({
        default_payment_method: paymentMethod.id,
        customer: customerId,
        items: [
          {
            price: priceId,
          },
        ],
        expand: ['latest_invoice.payment_intent'],
      });
      return subscription;
    } catch (error) {
      throw new InternalServerErrorException(
        error.message || 'Error creating a subscription',
      );
    }
  }

  async createSubscriptionV2(
    customerId: string,
    paymentMethodId: string,
    priceLookupKey: SubscriptionPlans,
  ) {
    const priceId = this.subscriptionPlanIds[priceLookupKey];

    await this.stripe.customers.update(customerId, {
      invoice_settings: { default_payment_method: paymentMethodId },
    });

    const subscription = await this.stripe.subscriptions.create({
      default_payment_method: paymentMethodId,
      customer: customerId,
      proration_behavior: 'create_prorations',
      items: [
        {
          price: priceId,
        },
      ],
      off_session: true,
      expand: ['latest_invoice.payment_intent'],
      // payment_behavior: 'error_if_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
    });

    console.log(subscription);

    return subscription;
  }

  async createSetupIntent(paymentMethodId: string, customerId: string) {
    return await this.stripe.setupIntents.create({
      customer: customerId,
      payment_method: paymentMethodId,
    });
  }

  async createSetupIntentV2(customerId: string) {
    return await this.stripe.setupIntents.create({
      customer: customerId,
      usage: 'off_session',
    });
  }

  async getSubscription(
    customerId: string,
    onlyActive = false,
    errorIfNone = true,
  ) {
    const subscriptions = await this.stripe.subscriptions.list({
      customer: customerId,
      limit: 1,
      status: onlyActive ? 'active' : 'all',
    });
    if (subscriptions.data.length === 0) {
      if (errorIfNone)
        throw new BadRequestException(
          'No subscriptions found for this customer',
        );
      return null;
    }
    const [subscription] = subscriptions.data;
    return subscription;
  }

  async changePaymentMethod(setupIntentId: string, customerId: string) {
    const setupIntent = await this.stripe.setupIntents.retrieve(setupIntentId, {
      expand: ['payment_method'],
    });
    if (setupIntent.status !== 'succeeded' || !setupIntent.payment_method)
      throw new BadRequestException('The setup intent has not succeeded');

    const paymentMethod = setupIntent.payment_method as Stripe.PaymentMethod;

    const subscription = await this.getSubscription(customerId, true);

    await this.stripe.subscriptions.update(subscription.id, {
      // This will be guaranteed string since we are not expanding the payment method
      default_payment_method: paymentMethod.id,
    });
    const res = paymentMethod.card;
    console.log(res);
    return res;
  }

  async getPaymentMethod(paymentMethodId) {
    return await this.stripe.paymentMethods.retrieve(paymentMethodId);
  }

  async getSubscriptionEndDate(customerId: string) {
    const customer = await this.stripe.subscriptions.list({
      customer: customerId,
      limit: 1,
      status: 'active',
    });
    const [subscription] = customer.data;
    if (!subscription)
      throw new HttpException(
        'Customer has no active subscription',
        HttpStatus.PAYMENT_REQUIRED,
      );

    // multiply by 1000 because stripe provides time in seconds and date requres miliseconds
    const invoiceEndTime = subscription.current_period_end * 1000;
    return invoiceEndTime;
  }

  async cancelSubscription(customerId: string) {
    const subscription = await this.getSubscription(customerId, true);
    return await this.stripe.subscriptions.update(subscription.id, {
      cancel_at_period_end: true,
    });
  }

  async resumeSubscription(customerId: string) {
    const subscription = await this.getSubscription(customerId, true);
    return await this.stripe.subscriptions.update(subscription.id, {
      cancel_at_period_end: false,
    });
  }

  async getListedPaidInvoices(customerId: string) {
    const invoices = await this.stripe.invoices.list({
      customer: customerId,
      status: 'paid',
    });
    return invoices.data;
  }

  /**
   * Construct a Stripe event which will be sent from Stripes Webhooks.
   * These events are used for certain events such as customers paying
   * their monthly subscription fee, canceling their subscription or
   * any other subscription and customer related events
   */
  public async constructEventFromPayload(signature: string, payload: Buffer) {
    const webhookSecret = this.configService.get('STRIPE_WEBHOOK_SECRET');
    return this.stripe.webhooks.constructEvent(
      payload,
      signature,
      webhookSecret,
    );
  }

  async getPaymentIntent(amount: number, companyStripeAccountId: string) {
    return await this.stripe.paymentIntents.create({
      amount: Math.round(amount),
      currency: 'hrk',
      transfer_data: {
        destination: companyStripeAccountId,
      },
      application_fee_amount: Math.round(amount * 0.02 + 200),
    });
  }

  async updateAndconfirmPaymentIntent(
    id: string,
    paymentMethodId: string,
    orderId: string,
  ) {
    await this.stripe.paymentIntents.update(id, {
      metadata: { orderId },
    });
    return await this.stripe.paymentIntents.confirm(id, {
      payment_method: paymentMethodId,
    });
  }

  async confirmStripeAccount(
    accountId: string,
    confirmAccountDto: ConfirmAccountDto,
    verificationFileFront: Express.Multer.File,
    verificationFileBack: Express.Multer.File,
  ) {
    const frontFile = await this.stripe.files.create({
      purpose: 'identity_document',
      file: {
        data: verificationFileFront.buffer,
        name: verificationFileFront.filename,
        type: 'application/octet-stream',
      },
    });
    const backFile = await this.stripe.files.create({
      purpose: 'identity_document',
      file: {
        data: verificationFileBack.buffer,
        name: verificationFileBack.filename,
        type: 'application/octet-stream',
      },
    });
    return await this.stripe.accounts.update('acct_1LNziA2UWceRYo9r', {
      business_profile: { url: confirmAccountDto.url },
      individual: {
        first_name: confirmAccountDto.firstName,
        last_name: confirmAccountDto.lastName,
        dob: {
          day: confirmAccountDto.dateOfBirth.getDate(),
          month: confirmAccountDto.dateOfBirth.getMonth() + 1,
          year: confirmAccountDto.dateOfBirth.getFullYear(),
        },
        address: {
          line1: confirmAccountDto.address,
          postal_code: confirmAccountDto.postalCode,
          city: confirmAccountDto.city,
        },
        verification: {
          document: { front: frontFile.id, back: backFile.id },
        },
      },
    });
  }

  async additionalStripeVerification(
    accountId: string,
    additionalVerificationDto: AdditionalVerificationDto,
    verificationFileFront?: Express.Multer.File,
    verificationFileBack?: Express.Multer.File,
  ) {
    const updateAccountParams: Stripe.AccountUpdateParams.Individual = {};
    if (additionalVerificationDto.email)
      updateAccountParams.email = additionalVerificationDto.email;
    if (additionalVerificationDto.phone)
      updateAccountParams.phone = additionalVerificationDto.phone;
    if (verificationFileFront && verificationFileBack) {
      const frontFile = await this.stripe.files.create({
        purpose: 'additional_verification',
        file: {
          data: verificationFileFront.buffer,
          name: verificationFileFront.filename,
          type: 'application/octet-stream',
        },
      });
      const backFile = await this.stripe.files.create({
        purpose: 'additional_verification',
        file: {
          data: verificationFileBack.buffer,
          name: verificationFileBack.filename,
          type: 'application/octet-stream',
        },
      });
      updateAccountParams.verification = {
        additional_document: {
          front: frontFile.id,
          back: backFile.id,
        },
      };
    }
    return await this.stripe.accounts.update(accountId, {
      individual: updateAccountParams,
    });
  }

  async addBankAccount(accountId: string, bankAccountDto: BankAccountDto) {
    console.log(accountId);

    const accountHolderName =
      bankAccountDto.type === 'individual'
        ? `${bankAccountDto.name} ${bankAccountDto.lastName}`
        : bankAccountDto.name;

    const externalAccountToken = await this.stripe.tokens.create({
      bank_account: {
        country: bankAccountDto.countryLocale,
        currency: bankAccountDto.currency,
        account_holder_name: accountHolderName,
        account_holder_type: bankAccountDto.type,
        account_number: bankAccountDto.iban,
      },
    });

    return await this.stripe.accounts.createExternalAccount(accountId, {
      external_account: externalAccountToken.id,
    });
  }

  async getStripeAccount(accountId: string) {
    return await this.stripe.accounts.retrieve({
      stripeAccount: accountId,
    });
  }

  async getAdditionalAccoutnRequirements(accountId: string) {
    const account = await this.stripe.accounts.retrieve({
      stripeAccount: accountId,
    });
    if (
      account.individual.verification.status ===
      StripeVerificationStatus.VERFIFIED
    ) {
      return { accountRequirements: null };
    }
    const requirements = [];
    account.requirements.currently_due.forEach((requirement) => {
      if (!requirements.includes(requirement)) requirements.push(requirement);
    });
    account.requirements.past_due.forEach((requirement) => {
      if (!requirements.includes(requirement)) requirements.push(requirement);
    });
    account.requirements.eventually_due.forEach((requirement) => {
      if (!requirements.includes(requirement)) requirements.push(requirement);
    });
    return { accountRequirements: requirements };
  }

  async getAccountBalance(accountId: string) {
    const res = await this.stripe.balance.retrieve({
      stripeAccount: accountId,
    });
    console.log(res);
    return res;
  }

  async withdrawFunds(accountId: string, withdrawDto: WithdrawDto) {
    this.validateWithdrawRequest(
      accountId,
      withdrawDto.amount,
      withdrawDto.currency,
    );
    const customerBankAccounts =
      await this.stripe.accounts.listExternalAccounts(accountId, {
        object: 'bank_account',
        limit: 1,
      });
    if (customerBankAccounts.data.length === 0)
      throw new BadRequestException('Customer has no bank accounts');
    console.log(withdrawDto);
    return await this.stripe.payouts.create(
      {
        amount: withdrawDto.amount,
        currency: withdrawDto.currency,
        description: customerBankAccounts.data[0].id,
      },
      { stripeAccount: accountId },
    );
  }

  private async validateWithdrawRequest(
    accountId: string,
    amount: number,
    currency: string,
  ) {
    const balance = await this.getAccountBalance(accountId);
    const balanceForCurrency = balance.available.find(
      (balanceItem) => balanceItem.currency === currency,
    );
    console.log(balanceForCurrency);
    if (!balanceForCurrency)
      throw new BadRequestException(
        "Customer doesn't have the available balance to perform such action",
      );
    if (balanceForCurrency.amount < amount)
      throw new BadRequestException(
        "Customer doesn't have the available balance to perform such action",
      );
    return true;
  }
}
