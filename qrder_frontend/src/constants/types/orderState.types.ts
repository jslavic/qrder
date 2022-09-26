import { OrderItemType } from "./orderItem.types";

export type OrdersState = { orders: OrderItemType[]; hasMore: boolean };
