import { IsEnum, IsIBAN, IsLocale, IsOptional, Length } from 'class-validator';
import { StripeCurrencies } from 'src/common/enum/stripeCurrencies';

enum AccountType {
  individual = 'individual',
  company = 'company',
}

export class BankAccountDto {
  @Length(1)
  name: string;

  @IsOptional()
  @Length(1)
  lastName?: string;

  @IsIBAN()
  iban: string;

  @IsEnum(StripeCurrencies)
  currency: string;

  @IsLocale()
  countryLocale: string;

  @IsEnum(AccountType)
  type: 'individual' | 'company';
}
