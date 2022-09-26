import { IsString } from 'class-validator';

export class CreateSetupIntentDto {
  @IsString()
  paymentMethodId: string;
}
