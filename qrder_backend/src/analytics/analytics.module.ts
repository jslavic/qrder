import { Module } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { Order, OrderSchema } from 'src/order/entity/order.entity';
import { PaymentModule } from 'src/payment/payment.module';
import { ProductModule } from 'src/product/product.module';
import { DiscountModule } from 'src/discount/discount.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    PassportModule.registerAsync({
      useFactory: async () => ({ property: 'company' }),
    }),
    PaymentModule,
    ProductModule,
    DiscountModule,
  ],
  providers: [AnalyticsService],
  controllers: [AnalyticsController],
})
export class AnalyticsModule {}
