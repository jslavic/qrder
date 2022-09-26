import { Type } from 'class-transformer';
import { IsDefined, ValidateNested } from 'class-validator';
import { CreateOrderDto } from './create-order.dto';

export class ConfirmPaymentDto {
  @IsDefined()
  paymentIntentId: string;

  @IsDefined()
  paymentMethodId: string;

  @ValidateNested()
  @Type(() => CreateOrderDto)
  order: CreateOrderDto;
}
