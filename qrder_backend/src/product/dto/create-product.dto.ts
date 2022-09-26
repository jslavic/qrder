import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsPositive, IsString } from 'class-validator';

export class CreateProductDto {
  @IsString()
  readonly name: string;

  @Type(() => Number)
  @IsPositive()
  readonly price: number;

  @IsOptional()
  @IsString()
  readonly description: string;

  @Type(() => Number)
  @IsOptional()
  @IsInt({ each: true })
  readonly discountIds: number[];

  @Type(() => Number)
  @IsOptional()
  @IsInt({ each: true })
  readonly addonIds: number[];
}
