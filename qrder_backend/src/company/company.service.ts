import {
  GoneException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, LessThan, Repository } from 'typeorm';
import Company from './entities/company.entity';
import { PaymentService } from 'src/payment/payment.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { getDateByDays } from 'src/helpers/getDateByDays';
import { v4 as uuidv4 } from 'uuid';
import EmailService from 'src/email/email.service';
import { ConfigService } from '@nestjs/config';
import { hash } from 'bcrypt';
import { availableCountryInfo } from 'src/common/constants/avaiableCountryInfo';
import { StripeVerificationStatus } from 'src/common/enum/stripeVerificationStatus.enum';

@Injectable()
export class CompanyService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    private readonly configService: ConfigService,
    private readonly paymentService: PaymentService,
    private readonly emailService: EmailService,
  ) {}

  async findById(id: number) {
    return await this.companyRepository.findOneByOrFail({ id });
  }

  async findByEmail(email: string) {
    return await this.companyRepository.findOneByOrFail({ email });
  }

  async findByCustomerId(customerId: string) {
    return await this.companyRepository.findOneByOrFail({
      customerId,
    });
  }

  async findAllExpiredSubscriptions() {
    const companies = await this.companyRepository.find({
      where: {
        subscriptionEnds: LessThan(new Date()),
        isSubscriptionActive: true,
      },
    });
    return companies;
  }

  async createCompany(createCompanyDto: CreateCompanyDto) {
    const company = this.companyRepository.create({
      ...createCompanyDto,
      currency: availableCountryInfo[createCompanyDto.countryCode].currency,
      timezoneOffset:
        availableCountryInfo[createCompanyDto.countryCode].timezoneOffset ||
        createCompanyDto.timezoneOffset,
    });
    await this.companyRepository.save(company);
    return company;
  }

  async deleteCompanyById(companyId: number) {
    try {
      await this.companyRepository.delete({ id: companyId });
    } catch (error) {
      throw new HttpException(
        'Error deleting the company',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Deletes a company aswell as the customer associated with that company
   */
  async fullDeleteCompany(companyId: number, customerId: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const company = await queryRunner.manager.findOneBy(Company, {
        id: companyId,
      });
      await queryRunner.manager.remove(company);
      await this.paymentService.deleteCustomerById(customerId);
      await queryRunner.commitTransaction();
      await queryRunner.release();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      throw new InternalServerErrorException('Failed to delete the company');
    }
  }

  async extendCompanySubscription(companyId: number, invoiceEndTime: number) {
    const company = await this.companyRepository.findOneBy({
      id: companyId,
    });
    if (!company)
      throw new HttpException(
        "Couldn't find the desired company",
        HttpStatus.NOT_FOUND,
      );
    company.isSubscriptionActive = true;
    company.subscriptionEnds = getDateByDays(3, invoiceEndTime);
    console.log(getDateByDays(3, invoiceEndTime));
    console.log(company.subscriptionEnds);
    const savedCompany = await this.companyRepository.save(company);
    return savedCompany;
  }

  async deactivateCompanySubscription(companyId: number) {
    try {
      const company = await this.companyRepository.findOneBy({
        id: companyId,
      });
      if (!company)
        throw new HttpException(
          "Couldn't find the desired company",
          HttpStatus.NOT_FOUND,
        );
      company.isSubscriptionActive = false;
      this.companyRepository.save(company);
    } catch (error) {
      throw new HttpException(
        'Error deactivating the company subscription',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async setCompanyVerificationStatus(
    accountId: string,
    verificationStatus: StripeVerificationStatus,
  ) {
    const company = await this.companyRepository.findOneByOrFail({ accountId });
    company.verificationStatus = verificationStatus;
    await this.companyRepository.save(company);
  }

  private async generateResetPasswordToken(companyId: number) {
    const company = await this.findById(companyId);
    company.passwordResetToken = uuidv4();
    company.passwordResetExpiration = getDateByDays(1);
    const savedCompany = await this.companyRepository.save(company);
    return savedCompany;
  }

  async sendPasswordResetEmail(comapnyId: number) {
    const company = await this.generateResetPasswordToken(comapnyId);
    this.emailService.sendMail({
      to: company.email,
      subject: 'Resetiranje vaše Qrder lozinke',
      text: `Kako biste resetirali vašu Qrder lozinku, molimo vas odite nas sljedeći link: ${this.configService.get(
        'FRONTEND_URL',
      )}/reset-password/${company.passwordResetToken}`,
    });
  }

  async resetPassword(newPassword: string, token: string) {
    const company = await this.companyRepository
      .createQueryBuilder('company')
      .addSelect('company.passwordResetExpiration')
      .where('company.passwordResetToken = :token', { token })
      .getOne();
    console.log(company);
    const currentTime = new Date();
    if (!company || currentTime > company.passwordResetExpiration)
      throw new GoneException('This token is no longer valid');
    company.password = await hash(newPassword, 10);
    company.passwordResetToken = null;
    company.passwordResetExpiration = null;
    await this.companyRepository.save(company);
    return company;
  }

  async companySubmittedFirstVerification(company: Company) {
    company.submittedFirstVerification = true;
    await this.companyRepository.save(company);
    return company;
  }
}
