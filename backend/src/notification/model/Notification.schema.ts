import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';

export type NotificationDocument = Notification & Document;

@Schema()
export class Notification {
  @Prop({ required: true , ref: 'User'})
  user_ids: string[];

  @Prop({ required: true })
  message: string;

  @Prop({ required: false , ref: 'User'})
  sender_id: string;

  @Prop({ default: Date.now })
  timestamp: Date;

  readonly _id?: string;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
