import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import JwtCompanyAuthGuard from 'src/authentication/company-authentication/guard/jwt-company-auth.guard';
import RequestWithCompany from 'src/authentication/company-authentication/interface/requestWithCompany.interface';
import { CreateSetupIntentDto } from './dto/create-setup-intent.dto';

import { PaymentService } from './payment.service';

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Get('/invoices')
  async invoices(@Body() body: { customerId: string }) {
    return await this.paymentService.getListedPaidInvoices(body.customerId);
  }

  @UseGuards(JwtCompanyAuthGuard)
  @Get('/balance')
  async getBalance(@Request() req: RequestWithCompany) {
    return await this.paymentService.getAccountBalance(req.company.accountId);
  }

  @UseGuards(JwtCompanyAuthGuard)
  @Post('/setup-intent')
  async createSetupIntent(
    @Request() req: RequestWithCompany,
    @Body() createSetupIntentDto: CreateSetupIntentDto,
  ) {
    return await this.paymentService.createSetupIntent(
      createSetupIntentDto.paymentMethodId,
      'cus_LsehLR8TXYVzEh',
      // req.company.customerId,
    );
  }

  @UseGuards(JwtCompanyAuthGuard)
  @Post('/setup-intent/v2')
  async createSetupIntentV2(@Request() req: RequestWithCompany) {
    return await this.paymentService.createSetupIntentV2(
      'cus_LseekVGO0TWtmd',
      // req.company.customerId,
    );
  }
}
