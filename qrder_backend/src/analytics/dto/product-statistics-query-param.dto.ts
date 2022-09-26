import { IsDate, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';

export class ProductStatisticsQueryParamDto {
  @Type(() => Number)
  @IsPositive()
  id: number;

  @Type(() => Date)
  @IsDate()
  before: Date;

  @Type(() => Date)
  @IsDate()
  after: Date;
}
