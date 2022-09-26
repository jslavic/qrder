import { IsInt, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateAddonDto {
  @IsString()
  name: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  price: number;

  @IsOptional()
  @IsInt({ each: true })
  readonly productIds: number[];
}
