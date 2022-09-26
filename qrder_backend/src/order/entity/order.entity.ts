import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Transform } from 'class-transformer';
import { OrderStatus } from '../enum/orderStatus.enum';
import { OrderType } from '../enum/orderType.enum';
import { OrderItem, OrderItemSchema } from './orderItem.entity';

export type OrderDocument = Order & Document;

@Schema({ timestamps: true })
export class Order {
  @Transform((value) => value.obj._id.toString())
  public _id: string;

  @Prop({ required: true })
  public companyId: number;

  @Prop({ required: true })
  public location: string;

  @Prop({ required: true })
  public orderType: OrderType;

  @Prop({
    required: true,
    default: OrderStatus.AWAITING_CONFIRMATION,
  })
  public orderStatus: OrderStatus;

  @Prop({ required: false })
  public customer?: string;

  @Prop({ required: false })
  public extraNotes?: string;

  @Prop({ required: false })
  public tip?: number;

  @Prop({ required: true })
  public totalPrice: number;

  @Prop({ required: true })
  public fees: number;

  @Prop({ required: true })
  public profit: number;

  @Prop({ required: false })
  public paymentIntentId: string;

  @Prop({ type: [OrderItemSchema], required: true })
  public orderedItems: OrderItem[];

  @Prop({ type: Date })
  public createdAt: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
