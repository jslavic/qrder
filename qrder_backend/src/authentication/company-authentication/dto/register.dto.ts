import {
  IsEmail,
  IsEnum,
  IsInt,
  Length,
  Matches,
  Max,
  Min,
} from 'class-validator';
import { AvailableCountries } from 'src/common/enum/availableCountries.enum';
import { SubscriptionPlans } from 'src/common/enum/subscriptionPlans.enum';

export class RegisterDto {
  @Length(1, 50)
  readonly name: string;

  @IsEmail()
  readonly email: string;

  @Matches(new RegExp('^(?=(.*[a-zA-Z]){1,})(?=(.*[0-9]){1,}).{8,}$'))
  readonly password: string;

  @IsEnum(AvailableCountries)
  readonly countryCode: AvailableCountries;

  @IsEnum(SubscriptionPlans)
  readonly subscriptionPlan: SubscriptionPlans;

  @IsInt()
  @Min(-720)
  @Max(720)
  readonly timezoneOffset: number;
}
