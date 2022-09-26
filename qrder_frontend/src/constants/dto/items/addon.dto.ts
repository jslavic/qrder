import { ProductDto } from "./product.dto";

export interface AddonDto {
  id: number;
  name: string;
  price: number;
  productIds: number[];
}

export interface AddonDtoWithRelations {
  id: number;
  name: string;
  price: number;
  products: ProductDto[];
}
