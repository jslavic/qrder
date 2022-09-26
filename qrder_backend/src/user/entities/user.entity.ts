import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Exclude, Transform } from 'class-transformer';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Transform(({ value }) => value.toString())
  public _id: string;

  @Prop({ unique: true })
  public email: string;

  @Prop()
  public name: string;

  @Prop()
  @Exclude()
  public password: string;

  @Prop({ unique: true })
  @Exclude()
  public customerId: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
