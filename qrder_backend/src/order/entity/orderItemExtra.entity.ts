import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false })
export class OrderItemExtra {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  price: number;
}

export const OrderItemExtraSchema =
  SchemaFactory.createForClass(OrderItemExtra);
