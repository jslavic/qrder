import { IsString } from 'class-validator';

export class ChangePaymentMethodDto {
  @IsString()
  setupIntentId: string;
}
