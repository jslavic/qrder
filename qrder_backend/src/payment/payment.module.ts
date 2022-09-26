import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';

@Module({
  controllers: [PaymentController],
  providers: [PaymentService],
  imports: [
    PassportModule.registerAsync({
      useFactory: async () => ({ property: 'company' }),
    }),
    ConfigModule,
  ],
  exports: [PaymentService],
})
export class PaymentModule {}
