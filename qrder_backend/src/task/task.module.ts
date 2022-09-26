import { Module } from '@nestjs/common';
import { CompanyModule } from 'src/company/company.module';
import { PaymentModule } from 'src/payment/payment.module';
import { TaskService } from './task.service';

@Module({
  imports: [CompanyModule, PaymentModule],
  providers: [TaskService],
  exports: [TaskService],
})
export class TaskModule {}
