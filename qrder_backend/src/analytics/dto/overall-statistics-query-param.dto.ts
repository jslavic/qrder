import { IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class OverallStatisticsQueryParamDto {
  @Type(() => Date)
  @IsDate()
  before: Date;

  @Type(() => Date)
  @IsDate()
  after: Date;
}
