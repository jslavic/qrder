import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Transform } from 'class-transformer';
import {
  OrderItemDiscount,
  OrderItemDiscountSchema,
} from './orderItemDiscount.entity';
import { OrderItemExtra, OrderItemExtraSchema } from './orderItemExtra.entity';

@Schema({ _id: false })
export class OrderItem {
  @Transform(({ value }) => value.toString())
  public _id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  itemId: number;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  imageUrl: string;

  @Prop({ type: OrderItemDiscountSchema, required: false })
  discount?: OrderItemDiscount;

  @Prop({ type: [OrderItemExtraSchema], required: false })
  extras?: OrderItemExtra;
}

export const OrderItemSchema = SchemaFactory.createForClass(OrderItem);
