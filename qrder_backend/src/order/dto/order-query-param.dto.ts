import { IsDate, IsOptional, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class OrderQueryParamDto {
  @Type(() => Number)
  @Min(0)
  skip: number;

  @IsOptional()
  @Type(() => Number)
  @Max(20)
  take: number;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  before?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  after?: Date;
}
