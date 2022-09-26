import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import JwtCompanyAuthGuard from 'src/authentication/company-authentication/guard/jwt-company-auth.guard';
import RequestWithCompany from 'src/authentication/company-authentication/interface/requestWithCompany.interface';
import { ConfirmAccountDto } from 'src/settings/dto/confirm-account.dto';
import { AdditionalVerificationDto } from './dto/additional-verification.dto';
import { BankAccountDto } from './dto/bank-account.dto';
import { SettingsService } from './settings.service';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @UseGuards(JwtCompanyAuthGuard)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'verificationFileFront', maxCount: 1 },
      { name: 'verificationFileBack', maxCount: 1 },
    ]),
  )
  @Post('/confirm-account')
  async confirmAccount(
    @Request() req: RequestWithCompany,
    @Body() confirmAccountDto: ConfirmAccountDto,
    @UploadedFiles()
    files: {
      verificationFileFront?: Express.Multer.File[];
      verificationFileBack?: Express.Multer.File[];
    },
  ) {
    return await this.settingsService.confirmStripeAccount(
      req.company,
      confirmAccountDto,
      files.verificationFileFront[0],
      files.verificationFileBack[0],
    );
  }

  @UseGuards(JwtCompanyAuthGuard)
  @Get('/additional-requirements')
  async getAdditionalRequirements(@Request() req: RequestWithCompany) {
    return await this.settingsService.getAdditionalAccountRequirements(
      req.company.accountId,
    );
  }

  @UseGuards(JwtCompanyAuthGuard)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'verificationFileFront', maxCount: 1 },
      { name: 'verificationFileBack', maxCount: 1 },
    ]),
  )
  @Post('/additional-requirements')
  async postAdditionalRequirements(
    @Request() req: RequestWithCompany,
    @Body() additionalVerificationDto: AdditionalVerificationDto,
    @UploadedFiles()
    files: {
      verificationFileFront?: Express.Multer.File[];
      verificationFileBack?: Express.Multer.File[];
    },
  ) {
    return await this.settingsService.additionalAccountVerification(
      req.company,
      additionalVerificationDto,
      files.verificationFileFront[0] ?? undefined,
      files.verificationFileBack[0] ?? undefined,
    );
  }

  @UseGuards(JwtCompanyAuthGuard)
  @Post('/bank-account')
  async addBankAccount(
    @Request() req: RequestWithCompany,
    @Body() bankAccountDto: BankAccountDto,
  ) {
    return await this.settingsService.addBankAccount(
      req.company.accountId,
      bankAccountDto,
    );
  }
}
