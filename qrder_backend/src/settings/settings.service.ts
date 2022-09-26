import { BadRequestException, Injectable } from '@nestjs/common';
import { CompanyService } from 'src/company/company.service';
import Company from 'src/company/entities/company.entity';
import { ConfirmAccountDto } from 'src/settings/dto/confirm-account.dto';
import { PaymentService } from 'src/payment/payment.service';
import { AdditionalVerificationDto } from './dto/additional-verification.dto';
import { StripeVerificationStatus } from 'src/common/enum/stripeVerificationStatus.enum';
import { BankAccountDto } from './dto/bank-account.dto';

@Injectable()
export class SettingsService {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly companyService: CompanyService,
  ) {}

  async confirmStripeAccount(
    company: Company,
    confirmAccountDto: ConfirmAccountDto,
    verificationFileFront: Express.Multer.File,
    verificationFileBack: Express.Multer.File,
  ) {
    const account = await this.paymentService.confirmStripeAccount(
      company.accountId,
      confirmAccountDto,
      verificationFileFront,
      verificationFileBack,
    );
    await this.companyService.companySubmittedFirstVerification(company);
    return account;
  }

  async additionalAccountVerification(
    company: Company,
    additionalVerificationDto: AdditionalVerificationDto,
    verificationFileFront?: Express.Multer.File,
    verificationFileBack?: Express.Multer.File,
  ) {
    return await this.paymentService.additionalStripeVerification(
      company.accountId,
      additionalVerificationDto,
      verificationFileFront,
      verificationFileBack,
    );
  }

  async getAdditionalAccountRequirements(accountId: string) {
    const response = await this.paymentService.getAdditionalAccoutnRequirements(
      accountId,
    );
    if (response.accountRequirements === null) {
      await this.companyService.setCompanyVerificationStatus(
        accountId,
        StripeVerificationStatus.VERFIFIED,
      );
    }
    return response;
  }

  async addBankAccount(accountId: string, bankAccountDto: BankAccountDto) {
    if (
      bankAccountDto.type === 'individual' &&
      bankAccountDto.lastName?.length === 0
    )
      throw new BadRequestException(
        'Last name must pre provided for inidividuals',
      );

    return await this.paymentService.addBankAccount(accountId, bankAccountDto);
  }
}
