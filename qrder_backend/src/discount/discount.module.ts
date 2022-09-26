import { Module } from '@nestjs/common';
import { DiscountService } from './discount.service';
import { DiscountController } from './discount.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import Discount from './entities/discount.entity';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    TypeOrmModule.forFeature([Discount]),
    PassportModule.registerAsync({
      useFactory: async () => ({ property: 'company' }),
    }),
  ],
  providers: [DiscountService],
  controllers: [DiscountController],
  exports: [DiscountService],
})
export class DiscountModule {}
