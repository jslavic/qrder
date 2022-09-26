import {
  IsArray,
  IsInt,
  IsOptional,
  IsPositive,
  Length,
  Min,
  ValidateNested,
} from 'class-validator';

export class CreateOrderDto {
  @IsOptional()
  @Length(1, 300)
  extraNotes?: string;

  @IsOptional()
  @IsPositive()
  tip?: number;

  @IsArray()
  @ValidateNested()
  productIds: ItemIds[];
}

export class ItemIds {
  @IsInt()
  @IsPositive()
  id: number;

  @IsInt()
  @IsPositive()
  @Min(1)
  quantity: number;

  @IsOptional()
  @IsArray()
  @ValidateNested()
  extrasIds: ExtrasIds[];
}

export class ExtrasIds {
  @IsInt()
  @IsPositive()
  id: number;

  @IsInt()
  @IsPositive()
  @Min(1)
  quantity: number;
}
