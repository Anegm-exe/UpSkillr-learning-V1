import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';

export type NotificationDocument = Notification & Document;

@Schema()
export class Notification {
  @Prop({ required: true , ref: 'User'})
  userId: Types.ObjectId;

  @Prop({ required: true })
  message: string;

  @Prop({ required: false , ref: 'User'})
  senderId: Types.ObjectId;

  @Prop({ default: Date.now })
  timestamp: Date;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
