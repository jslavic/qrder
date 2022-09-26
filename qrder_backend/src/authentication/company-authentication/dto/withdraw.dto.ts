import { IsDefined, IsEnum, IsPositive } from 'class-validator';
import { StripeCurrencies } from 'src/common/enum/stripeCurrencies';

export class WithdrawDto {
  @IsDefined()
  password: string;

  @IsPositive()
  amount: number;

  @IsEnum(StripeCurrencies)
  currency: string;
}
