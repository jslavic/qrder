import {
  IsDefined,
  IsEmail,
  IsEnum,
  IsInt,
  Length,
  Max,
  Min,
} from 'class-validator';
import { AvailableCountries } from 'src/common/enum/availableCountries.enum';
import { SubscriptionPlans } from 'src/common/enum/subscriptionPlans.enum';

export class CreateCompanyDto {
  @Length(1, 50)
  readonly name: string;

  @IsEmail()
  readonly email: string;

  @IsDefined()
  readonly password: string;

  @IsEnum(SubscriptionPlans)
  readonly subscriptionPlan: SubscriptionPlans;

  @IsEnum(AvailableCountries)
  readonly countryCode: AvailableCountries;

  @IsDefined()
  readonly customerId: string;

  @IsDefined()
  readonly accountId: string;

  @IsInt()
  @Min(-720)
  @Max(720)
  readonly timezoneOffset: number;
}
