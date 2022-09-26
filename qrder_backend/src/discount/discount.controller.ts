import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import JwtCompanyAuthGuard from 'src/authentication/company-authentication/guard/jwt-company-auth.guard';
import RequestWithCompany from 'src/authentication/company-authentication/interface/requestWithCompany.interface';
import { DiscountService } from './discount.service';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { UpdateDiscountDto } from './dto/update-discount.dto';
import { DateValidationPipe } from './pipes/date-validation.pipe';
import { PercentageValidationPipe } from './pipes/percentage-validation.pipe';

@Controller('discount')
export class DiscountController {
  constructor(private readonly discountService: DiscountService) {}

  @UseGuards(JwtCompanyAuthGuard)
  @Get()
  async getDiscountsByAuthCompany(@Request() req: RequestWithCompany) {
    return await this.discountService.getAllCompanyDiscounts(req.company.id);
  }

  @Get('/:id')
  async getDiscountById(@Param('id') id: number) {
    const discount = await this.discountService.getDiscountById(id);
    return discount;
  }

  @UseGuards(JwtCompanyAuthGuard)
  @Post()
  async createDiscount(
    @Request() req: RequestWithCompany,
    @Body(new DateValidationPipe(), new PercentageValidationPipe())
    createDiscountDto: CreateDiscountDto,
  ) {
    const newDiscount = await this.discountService.createDiscount(
      createDiscountDto,
      req.company,
    );
    return newDiscount;
  }

  @UseGuards(JwtCompanyAuthGuard)
  @Patch('/:id')
  async updateDiscount(
    @Request() req: RequestWithCompany,
    @Body(new DateValidationPipe(), new PercentageValidationPipe())
    updateDiscountDto: UpdateDiscountDto,
    @Param('id') id: number,
  ) {
    console.log('am i here');
    const existingDiscount =
      await this.discountService.getDiscountByIdAndCompanyId(
        id,
        req.company.id,
      );
    const updatedDiscount = await this.discountService.updateDiscount(
      updateDiscountDto,
      existingDiscount,
      req.company.timezoneOffset,
    );
    return updatedDiscount;
  }

  @UseGuards(JwtCompanyAuthGuard)
  @Delete('/:id')
  async deleteDiscount(
    @Request() req: RequestWithCompany,
    @Param('id') id: number,
  ) {
    const existingDiscount =
      await this.discountService.getDiscountByIdAndCompanyId(
        id,
        req.company.id,
      );
    if (!existingDiscount)
      throw new NotFoundException(
        'Discount with this ID does not exist for this company',
      );
    return await this.discountService.deleteDiscount(existingDiscount);
  }
}
