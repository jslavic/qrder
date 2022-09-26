import { Injectable } from '@nestjs/common';
import { Cron, SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { CompanyService } from 'src/company/company.service';
import { PaymentService } from 'src/payment/payment.service';
import Company from 'src/company/entities/company.entity';
import { getDateByDays } from 'src/helpers/getDateByDays';

@Injectable()
export class TaskService {
  constructor(
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly companyService: CompanyService,
    private readonly paymentService: PaymentService,
  ) {}

  /**
   * Check for any expired subscriptions that might have been missed due to errors in the system, runs at the 1st day of the month at 6am to avoid being ran during peak usage
   */
  @Cron('0 6 1 * *')
  async checkForExipredSubscriptions() {
    const companies = await this.companyService.findAllExpiredSubscriptions();
    for (const company of companies) {
      const subscription = await this.paymentService.getSubscription(
        company.customerId,
      );
      if (!subscription || subscription.status !== 'active')
        await this.companyService.deactivateCompanySubscription(company.id);
    }
  }

  /**
   * Check weather a company has activated it's subscription in the time period of a day,
   * if it doesn't have any paid invoices, then delete the customer and company
   * to avoid cluttering the database
   */
  public schedulePaidInvoiceCheck(company: Company) {
    const scheduleDate = getDateByDays(1);
    const job = new CronJob(scheduleDate, async () => {
      const paidInvoices = await this.paymentService.getListedPaidInvoices(
        company.customerId,
      );
      if (paidInvoices.length !== 0) return;
      await this.paymentService.deleteCustomerById(company.customerId);
      await this.companyService.deleteCompanyById(company.id);
    });
    this.schedulerRegistry.addCronJob(
      `Validate initial payment by ${
        company.name
      } started on ${Date.now().toLocaleString()}`,
      job,
    );
    job.start();
  }

  public scheduleSubscriptionExpiryCheck(company: Company) {
    const jobName = `${company.name}Job`;
    if (this.schedulerRegistry.doesExist('cron', jobName))
      this.schedulerRegistry.deleteCronJob(jobName);
    const scheduleDate = company.subscriptionEnds;
    const job = new CronJob(scheduleDate, async () => {
      const subscription = await this.paymentService.getSubscription(
        company.customerId,
      );
      if (!subscription || subscription.status !== 'active')
        await this.companyService.deactivateCompanySubscription(company.id);
    });
    this.schedulerRegistry.addCronJob(jobName, job);
    job.start();
  }
}
