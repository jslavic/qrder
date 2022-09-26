import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Request,
  UseGuards,
} from '@nestjs/common';
import JwtCompanyAuthGuard from 'src/authentication/company-authentication/guard/jwt-company-auth.guard';
import RequestWithCompany from 'src/authentication/company-authentication/interface/requestWithCompany.interface';
import { CompanyService } from './company.service';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @UseGuards(JwtCompanyAuthGuard)
  @Get()
  async getCompany(@Request() req: RequestWithCompany) {
    return req.company;
  }

  @UseGuards(JwtCompanyAuthGuard)
  @Delete()
  async deleteCompany(@Request() req: RequestWithCompany) {
    try {
      const { id: companyId, customerId } = req.company;
      await this.companyService.fullDeleteCompany(companyId, customerId);
      return { message: 'Success' };
    } catch (error) {
      throw error;
    }
  }

  @UseGuards(JwtCompanyAuthGuard)
  @Get('/reset-password')
  async sendResetPasswordMail(@Request() req: RequestWithCompany) {
    const { company } = req;
    await this.companyService.sendPasswordResetEmail(company.id);
    return { message: 'succcess' };
  }

  @Patch('/reset-password/:token')
  async resetPassword(
    @Param('token') token: string,
    @Body() resetPasswordDto: ResetPasswordDto,
  ) {
    const company = await this.companyService.resetPassword(
      resetPasswordDto.newPassword,
      token,
    );
    return company;
  }

  @Get('/test/:id')
  async test(@Param('id') email: string) {
    const company = await this.companyService.findByEmail(email);
    return company;
  }
}
