import { OrderStatus } from "../enums/orderEnums/orderStatus.enums";
import { OrderType } from "../enums/orderEnums/orderType.enum";

export type OrderItemType = {
  _id: string;
  customer: string | null;
  createdAt: string;
  orderType: OrderType;
  orderStatus: OrderStatus;
  extraNotes: string;
  location: string;
  orderedItems: {
    discount: { name: string; amount: string; originalPrice: number };
    extras: { name: string; price: number; quantity: number }[];
    imageUrl: string;
    itemId: number;
    name: string;
    price: number;
    quantity: number;
  }[];
  totalPrice: number;
  tip?: number;
  fees: number;
  profit: number;
};
