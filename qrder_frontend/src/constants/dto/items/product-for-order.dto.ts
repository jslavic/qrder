import { AddonDto } from "./addon.dto";

export interface ProductForOrderDto {
  id: number;
  name: string;
  price: number;
  description: string;
  imageUrl: string | null;
  createdAt: string;
  addons: AddonDto[];
  discount: {
    discountPrice: number;
    discountAmount: string;
    lastingTo: string;
  };
}
