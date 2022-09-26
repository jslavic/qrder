import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false })
export class OrderItemDiscount {
  @Prop({ required: true })
  discountId: number;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  amount: string;

  @Prop({ required: true })
  originalPrice: number;
}

export const OrderItemDiscountSchema =
  SchemaFactory.createForClass(OrderItemDiscount);
