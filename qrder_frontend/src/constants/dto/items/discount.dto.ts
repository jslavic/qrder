import { RepeatedDays } from "../../enums/discountEnums/repeatedDays.enum";
import { RepeatedDiscount } from "../../enums/discountEnums/repeatedDiscount";
import { ProductDto } from "./product.dto";

export interface DiscountDto {
  id: number;
  name: string;
  repeated: RepeatedDiscount;
  repeatedDays: RepeatedDays[];
  from: Date;
  to: Date;
  type: "PERCENTAGE" | "AMOUNT";
  amount: number;
  productIds: number[];
}

export interface DiscountDtoWithRelations {
  id: number;
  name: string;
  repeated: RepeatedDiscount;
  repeatedDays: RepeatedDays[];
  from: Date;
  to: Date;
  type: "PERCENTAGE" | "AMOUNT";
  amount: number;
  products: ProductDto[];
}
