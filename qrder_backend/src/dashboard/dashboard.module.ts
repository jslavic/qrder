import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AddonModule } from 'src/addon/addon.module';
import { DiscountModule } from 'src/discount/discount.module';
import { ProductModule } from 'src/product/product.module';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

@Module({
  imports: [
    PassportModule.registerAsync({
      useFactory: async () => ({ property: 'company' }),
    }),
    ProductModule,
    DiscountModule,
    AddonModule,
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
