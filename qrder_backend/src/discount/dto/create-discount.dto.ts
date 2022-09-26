import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsDefined,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  Length,
} from 'class-validator';
import { RepeatedDays } from '../enum/repeatedDays.enum';
import { RepeatedDiscount } from '../enum/repeatedDiscount.enum';

export class CreateDiscountDto {
  @Length(1, 50)
  readonly name: string;

  @IsEnum(RepeatedDiscount)
  readonly repeated: RepeatedDiscount;

  @IsOptional()
  @IsEnum(RepeatedDays, { each: true })
  @IsArray()
  readonly repeatedDays: RepeatedDays[];

  @Type(() => Date)
  @IsDate()
  from: Date;

  @Type(() => Date)
  @IsDate()
  to: Date;

  @IsDefined()
  readonly type: 'PERCENTAGE' | 'AMOUNT';

  @IsNumber({ maxDecimalPlaces: 2 }, {})
  @IsPositive()
  readonly amount: number;

  @IsOptional()
  @IsInt({ each: true })
  readonly productIds: number[];
}
