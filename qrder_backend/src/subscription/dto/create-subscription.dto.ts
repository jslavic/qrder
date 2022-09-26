import { IsEnum, IsString } from 'class-validator';
import { SubscriptionPlans } from 'src/common/enum/subscriptionPlans.enum';

export class CreateSubscriptionDto {
  @IsString()
  paymentMethodId: string;
}

export class CreateSubscriptionDtoV2 {
  @IsString()
  paymentMethodId: string;

  @IsEnum(SubscriptionPlans)
  priceLookupKey: SubscriptionPlans;
}
