import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { AddonModule } from 'src/addon/addon.module';
import { CompanyModule } from 'src/company/company.module';
import { DiscountModule } from 'src/discount/discount.module';
import { EncryptionModule } from 'src/encryption/encryption.module';
import { PaymentModule } from 'src/payment/payment.module';
import { ProductModule } from 'src/product/product.module';
import { TableModule } from 'src/table/table.module';
import { Order, OrderSchema } from './entity/order.entity';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    PassportModule.registerAsync({
      useFactory: async () => ({ property: 'company' }),
    }),
    CompanyModule,
    DiscountModule,
    TableModule,
    ProductModule,
    AddonModule,
    PaymentModule,
    EncryptionModule,
  ],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}
