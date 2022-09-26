import { AddonDto } from "./addon.dto";
import { DiscountDto } from "./discount.dto";

export interface ProductDto {
  id: number;
  name: string;
  price: number;
  description: string;
  imageUrl: string | null;
  createdAt: string;
  discountIds: number[];
  addonIds: number[];
}

export interface ProductDtoWithRelations {
  id: number;
  name: string;
  price: number;
  description: string;
  imageUrl: string | null;
  createdAt: string;
  discounts: DiscountDto[];
  addons: AddonDto[];
}
