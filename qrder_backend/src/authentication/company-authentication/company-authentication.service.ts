import { compare, hash } from 'bcrypt';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CompanyService } from 'src/company/company.service';
import { PaymentService } from 'src/payment/payment.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { SchedulerRegistry } from '@nestjs/schedule';
import { RegisterDto } from './dto/register.dto';
import Company from 'src/company/entities/company.entity';
import PostgresErrorCode from 'src/database/enums/postgresErrorCodes.enum';
import { CronJob } from 'cron';
import { getDateByDays } from 'src/helpers/getDateByDays';
import { WithdrawDto } from './dto/withdraw.dto';

@Injectable()
export class CompanyAuthenticationService {
  constructor(
    private readonly companyService: CompanyService,
    private readonly paymentService: PaymentService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly schedulerRegistry: SchedulerRegistry,
  ) {}

  async register(registerDto: RegisterDto, ipAddress: string) {
    const existingCustomers = await this.paymentService.findCustomersByEmail(
      registerDto.email,
    );
    if (existingCustomers.length !== 0)
      throw new ConflictException('Customer with that email already exists');
    const customer = await this.paymentService.createCustomer(
      registerDto.email,
    );
    const connectedAccount = await this.paymentService.createConnectedAccount(
      registerDto.name,
      registerDto.email,
      registerDto.countryCode,
      ipAddress,
    );
    try {
      const hashedPassword = await hash(registerDto.password, 10);
      const registeredCompany = await this.companyService.createCompany({
        ...registerDto,
        password: hashedPassword,
        customerId: customer.id,
        accountId: connectedAccount.id,
      });
      this.scheduleSubscriptionCheck(registeredCompany);
      return { company: registeredCompany, customer: customer };
    } catch (error) {
      this.paymentService.deleteCustomerById(customer.id);
      if (error?.code === PostgresErrorCode.UniqueViolation) {
        throw new ConflictException('User with that mail already exists');
      }
      throw new InternalServerErrorException(
        'An error occured while creating a new company',
      );
    }
  }

  public async getAuthenticatedCompany(email: string, hashedPassword: string) {
    try {
      const company = await this.companyService.findByEmail(email);
      await this.verifyPassword(hashedPassword, company.password);
      return company;
    } catch (error) {
      throw new BadRequestException('Invalid credentials provided');
    }
  }

  private async verifyPassword(password: string, hashedPassword: string) {
    const isPasswordMatching = await compare(password, hashedPassword);
    if (!isPasswordMatching) {
      throw new BadRequestException('Invalid credentials provided');
    }
  }

  async getCookieWithJwtToken(companyId: number, hashedPassword: string) {
    const payload = { sub: { companyId, hashedPassword } };
    const token = await this.jwtService.signAsync(payload);
    return `Authorization=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get(
      'JWT_COMPANY_ACCESS_TOKEN_EXPIRATION_TIME',
    )}`;
  }

  async getAuthTypeCookie() {
    return `AuthType=Company; Path=/; Max-Age=${this.configService.get(
      'JWT_COMPANY_ACCESS_TOKEN_EXPIRATION_TIME',
    )}`;
  }

  getCookieForLogOut() {
    return `Authorization=; HttpOnly; Path=/; Max-Age=0`;
  }

  async handleWithdrawRequest(company: Company, withdrawDto: WithdrawDto) {
    await this.verifyPassword(withdrawDto.password, company.password);
    return await this.paymentService.withdrawFunds(
      company.accountId,
      withdrawDto,
    );
  }

  /**
   * Check weather a company has activated it's subscription in the time period of 5 days,
   * if it doesn't have any paid invoices, then delete the customer and company
   * to avoid cluttering the database
   */
  private scheduleSubscriptionCheck(company: Company) {
    const scheduleDate = getDateByDays(5); // Returns the date 5 days from now
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
}
