import { Type } from 'class-transformer';
import { IsDate, IsPostalCode, IsUrl, MinLength } from 'class-validator';

export class ConfirmAccountDto {
  @IsUrl()
  url: string;

  @MinLength(1)
  firstName: string;

  @MinLength(1)
  lastName: string;

  @Type(() => Date)
  @IsDate()
  dateOfBirth: Date;

  @MinLength(1)
  address: string;

  @IsPostalCode('any')
  postalCode: string;

  @MinLength(1)
  city: string;
}
