import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { Request } from 'express';
import JwtCompanyAuthGuard from 'src/authentication/company-authentication/guard/jwt-company-auth.guard';
import RequestWithCompany from 'src/authentication/company-authentication/interface/requestWithCompany.interface';
import MongooseOrdersSerializerInterceptor from 'src/common/interceptors/mongooseOrdersSerializer.interceptor';
import { ConfirmPaymentDto } from './dto/confirm-payment.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from './entity/order.entity';
import { OrderService } from './order.service';
import { OrderQueryParamDto } from './dto/order-query-param.dto';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @UseInterceptors(MongooseOrdersSerializerInterceptor(Order))
  @UseGuards(JwtCompanyAuthGuard)
  @Get()
  async getOrders(@Req() req: RequestWithCompany) {
    const orders = await this.orderService.getOrders(req.company.id);
    return orders;
  }

  @UseInterceptors(MongooseOrdersSerializerInterceptor(Order))
  @UseGuards(JwtCompanyAuthGuard)
  @Get('/unconfirmed')
  async getUnconfirmedOrders(
    @Req() req: RequestWithCompany,
    @Query('skip') skip: number,
  ) {
    const response = await this.orderService.getUnconfirmedOrders(
      req.company.id,
      skip,
    );
    return { response };
  }

  @UseInterceptors(MongooseOrdersSerializerInterceptor(Order))
  @UseGuards(JwtCompanyAuthGuard)
  @Get('/confirmed')
  async getConfirmedOrders(
    @Req() req: RequestWithCompany,
    @Query(
      new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
        forbidNonWhitelisted: true,
      }),
    )
    query: OrderQueryParamDto,
  ) {
    const { skip, take, before, after } = query;
    const response = await this.orderService.getConfirmedOrders(
      req.company.id,
      skip,
      take || 8,
      req.company.timezoneOffset,
      after,
      before,
    );
    return { response };
  }

  @Post('/:encryptedQrData')
  async createOrder(
    @Body() createOrderDto: CreateOrderDto,
    @Param('encryptedQrData') encryptedQrData: string,
  ) {
    return await this.orderService.sendUnpaidOrder(
      createOrderDto,
      encryptedQrData,
    );
  }

  @UseGuards(JwtCompanyAuthGuard)
  @Patch('/confirm/:orderId')
  async acceptOrder(
    @Req() req: RequestWithCompany,
    @Param('orderId') orderId: string,
  ) {
    return await this.orderService.acceptOrder(req.company.id, orderId);
  }

  @UseGuards(JwtCompanyAuthGuard)
  @Patch('/reject/:orderId')
  async rejectOrder(
    @Req() req: RequestWithCompany,
    @Param('orderId') orderId: string,
  ) {
    return await this.orderService.rejectOrder(req.company.id, orderId);
  }

  @Post('/price/:encryptedQrData')
  @HttpCode(200)
  async getOrderPrice(
    @Req() request: Request,
    @Body() createOrderDto: CreateOrderDto,
    @Param('encryptedQrData') encryptedQrData: string,
  ) {
    const ipAddress = request.ip;
    console.log(ipAddress);
    return await this.orderService.setupPayment(
      createOrderDto,
      encryptedQrData,
    );
  }

  @Post('/pay/:encryptedQrData')
  async confirmOrder(
    @Body() confirmPaymentDto: ConfirmPaymentDto,
    @Param('encryptedQrData') encryptedQrData: string,
  ) {
    return await this.orderService.confirmPayment(
      confirmPaymentDto,
      encryptedQrData,
    );
  }
}
