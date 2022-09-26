import {
  Controller,
  Get,
  Query,
  Request,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import JwtCompanyAuthGuard from 'src/authentication/company-authentication/guard/jwt-company-auth.guard';
import RequestWithCompany from 'src/authentication/company-authentication/interface/requestWithCompany.interface';
import { AnalyticsService } from './analytics.service';
import { OverallStatisticsQueryParamDto } from './dto/overall-statistics-query-param.dto';
import { ProductStatisticsQueryParamDto } from './dto/product-statistics-query-param.dto';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyitcsService: AnalyticsService) {}

  @UseGuards(JwtCompanyAuthGuard)
  @Get()
  async getAllAnalytics(
    @Request() req: RequestWithCompany,
    @Query(
      new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
        forbidNonWhitelisted: true,
      }),
    )
    query: OverallStatisticsQueryParamDto,
  ) {
    const res = await this.analyitcsService.getAllAnalyticsInfo(
      req.company,
      query.after,
      query.before,
    );
    console.log(res);
    return res;
  }

  @UseGuards(JwtCompanyAuthGuard)
  @Get('/product')
  async get(
    @Request() req: RequestWithCompany,
    @Query(
      new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
        forbidNonWhitelisted: true,
      }),
    )
    query: ProductStatisticsQueryParamDto,
  ) {
    const res = await this.analyitcsService.getProductAnalyticsInfo(
      req.company,
      query.id,
      query.after,
      query.before,
    );
    console.log(res);
    return res;
  }
}
