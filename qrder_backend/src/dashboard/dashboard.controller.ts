import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateAddonDto } from 'src/addon/dto/create-addon.dto';
import { UpdateAddonDto } from 'src/addon/dto/update-addon.dto';
import JwtCompanyAuthGuard from 'src/authentication/company-authentication/guard/jwt-company-auth.guard';
import RequestWithCompany from 'src/authentication/company-authentication/interface/requestWithCompany.interface';
import { CreateDiscountDto } from 'src/discount/dto/create-discount.dto';
import { UpdateDiscountDto } from 'src/discount/dto/update-discount.dto';
import { DateValidationPipe } from 'src/discount/pipes/date-validation.pipe';
import { PercentageValidationPipe } from 'src/discount/pipes/percentage-validation.pipe';
import { CreateProductDto } from 'src/product/dto/create-product.dto';
import { UpdateProductDto } from 'src/product/dto/update-product.dto';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
@UseGuards(JwtCompanyAuthGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  async getAllDashboardItems(@Request() req: RequestWithCompany) {
    return await this.dashboardService.getAllDashboardItems(req.company.id);
  }

  @UseInterceptors(FileInterceptor('file'))
  @Post('/product')
  async addProduct(
    @Body() createProductDto: CreateProductDto,
    @Request() req: RequestWithCompany,
    @UploadedFile() file: Express.Multer.File,
  ) {
    console.log(createProductDto.addonIds);
    return await this.dashboardService.addProductWithRelations(
      createProductDto,
      req.company,
      file.buffer,
    );
  }

  @UseInterceptors(FileInterceptor('file'))
  @Patch('product/:id')
  async editProduct(
    @Request() req: RequestWithCompany,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFile() file: Express.Multer.File,
    @Param('id') id: number,
  ) {
    return await this.dashboardService.updateProductWithRelations(
      id,
      req.company.id,
      updateProductDto,
      file ? file.buffer : null,
    );
  }

  @Post('/discount')
  async addDiscount(
    @Body(new DateValidationPipe(), new PercentageValidationPipe())
    createDiscountDto: CreateDiscountDto,
    @Request() req: RequestWithCompany,
  ) {
    return await this.dashboardService.addDiscountWithRelations(
      createDiscountDto,
      req.company,
    );
  }

  @Patch('discount/:id')
  async editDiscount(
    @Param('id') id: number,
    @Body(new DateValidationPipe(), new PercentageValidationPipe())
    updateDiscountDto: UpdateDiscountDto,
    @Request() req: RequestWithCompany,
  ) {
    return await this.dashboardService.updateDiscountWithRelations(
      id,
      req.company.id,
      req.company.timezoneOffset,
      updateDiscountDto,
    );
  }

  @Post('/addon')
  async addAddon(
    @Body() createAddonDto: CreateAddonDto,
    @Request() req: RequestWithCompany,
  ) {
    return await this.dashboardService.addAddonWithRelations(
      createAddonDto,
      req.company,
    );
  }

  @Patch('addon/:id')
  async editAddon(
    @Param('id') id: number,
    @Body() updateAddonDto: UpdateAddonDto,
    @Request() req: RequestWithCompany,
  ) {
    return this.dashboardService.updateAddonWithRelations(
      id,
      req.company.id,
      updateAddonDto,
    );
  }
}
