import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import JwtCompanyAuthGuard from 'src/authentication/company-authentication/guard/jwt-company-auth.guard';
import RequestWithCompany from 'src/authentication/company-authentication/interface/requestWithCompany.interface';
import { ChangePaymentMethodDto } from './dto/change-payment-method.dto';
import {
  CreateSubscriptionDto,
  CreateSubscriptionDtoV2,
} from './dto/create-subscription.dto';
import { SubscriptionService } from './subscription.service';

@Controller('subscription')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @UseGuards(JwtCompanyAuthGuard)
  @Get()
  async getSubscriptionInfo(@Request() req: RequestWithCompany) {
    return await this.subscriptionService.getSubscription(req.company);
  }

  @UseGuards(JwtCompanyAuthGuard)
  @Post('/create')
  async createSubscription(
    @Request() req: RequestWithCompany,
    @Body() createSubscriptionDto: CreateSubscriptionDto,
  ) {
    const { company } = req;
    console.log(company);
    const subscription = await this.subscriptionService.createSubscription(
      company,
      createSubscriptionDto.paymentMethodId,
    );
    return { subscription };
  }

  @UseGuards(JwtCompanyAuthGuard)
  @Post('/create/v2')
  async createSubscriptionV2(
    @Request() req: RequestWithCompany,
    @Body() createSubscriptionDto: CreateSubscriptionDtoV2,
  ) {
    const subscription = await this.subscriptionService.createSubscriptionV2(
      'cus_LseekVGO0TWtmd',
      // req.company.customerId,
      createSubscriptionDto,
    );
    return { subscription };
  }

  @UseGuards(JwtCompanyAuthGuard)
  @Patch('/activate')
  async activateCompanySubscription(@Request() req: RequestWithCompany) {
    const { id: companyId, customerId } = req.company;
    await this.subscriptionService.extendSubscription(companyId, customerId);
    return { message: 'Success' };
  }

  @UseGuards(JwtCompanyAuthGuard)
  @Patch('/payment')
  async changePaymentMethod(
    @Request() req: RequestWithCompany,
    @Body() changePaymentMethodDto: ChangePaymentMethodDto,
  ) {
    return await this.subscriptionService.changePaymentMethod(
      changePaymentMethodDto.setupIntentId,
      req.company.customerId,
    );
  }

  @UseGuards(JwtCompanyAuthGuard)
  @Patch('/cancel')
  async cancelSubscription(@Request() req: RequestWithCompany) {
    return await this.subscriptionService.cancelSubscription(
      req.company.customerId,
    );
  }

  @UseGuards(JwtCompanyAuthGuard)
  @Patch('/resume')
  async resumeSubscription(@Request() req: RequestWithCompany) {
    return await this.subscriptionService.resumeSubscription(
      req.company.customerId,
    );
  }
}
