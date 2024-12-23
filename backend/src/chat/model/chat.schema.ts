import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ChatDocument = Chat & Document;

@Schema()
export class Chat {
  @Prop({ required: true, ref: 'User' })
  admin_id: string

  @Prop({ required: true })
  name: string;

  @Prop({
    type: [String],
    ref: 'User',
    required: true,
  })
  user_ids: string[];

  @Prop({ default: [], ref: 'Message' })
  messages: string[];

  readonly _id?: string;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
