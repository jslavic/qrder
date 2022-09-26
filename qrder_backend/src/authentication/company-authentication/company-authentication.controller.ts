import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { CompanyAuthenticationService } from './company-authentication.service';
import { RegisterDto } from './dto/register.dto';
import { WithdrawDto } from './dto/withdraw.dto';
import JwtCompanyAuthGuard from './guard/jwt-company-auth.guard';
import LocalCompanyAuthGuard from './guard/local-company-auth.guard';
import RequestWithCompany from './interface/requestWithCompany.interface';

@Controller('company-authentication')
export class CompanyAuthenticationController {
  constructor(
    private readonly companyAuthenticationService: CompanyAuthenticationService,
  ) {}

  @UseGuards(JwtCompanyAuthGuard)
  @Get()
  async getAuthCompany(@Req() request: RequestWithCompany) {
    console.log('hit');
    return request.company;
  }

  @Post('/register')
  async register(@Req() request: Request, @Body() registerDto: RegisterDto) {
    const { company, customer } =
      await this.companyAuthenticationService.register(registerDto, request.ip);
    const cookie =
      await this.companyAuthenticationService.getCookieWithJwtToken(
        company.id,
        company.password,
      );
    request.res.setHeader('Set-Cookie', cookie);
    return customer;
  }

  @HttpCode(200)
  @UseGuards(LocalCompanyAuthGuard)
  @Post('/login')
  async login(@Req() request: RequestWithCompany) {
    const { company } = request;
    const accessTokenCookie =
      await this.companyAuthenticationService.getCookieWithJwtToken(
        company.id,
        company.password,
      );
    const authTypeCookie =
      await this.companyAuthenticationService.getAuthTypeCookie();
    request.res.setHeader('Set-Cookie', [accessTokenCookie, authTypeCookie]);
    return company;
  }

  @HttpCode(200)
  @UseGuards(JwtCompanyAuthGuard)
  @Post('/logout')
  async logOut(@Req() request: RequestWithCompany) {
    request.res.clearCookie('AuthType');
    request.res.setHeader(
      'Set-Cookie',
      this.companyAuthenticationService.getCookieForLogOut(),
    );
    return { message: 'success' };
  }

  @UseGuards(JwtCompanyAuthGuard)
  @Post('/withdraw-funds')
  async withdrawFunds(
    @Req() request: RequestWithCompany,
    @Body() withdrawDto: WithdrawDto,
  ) {
    return await this.companyAuthenticationService.handleWithdrawRequest(
      request.company,
      withdrawDto,
    );
  }
}
