import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';
import { Message } from './message.schema';

export type ChatDocument = Chat & Document;

@Schema()
export class Chat {
  @Prop({ required: true })
  name: string;

  @Prop({
    type: [String],
    ref: 'User',
    required: true,
    validate: {
      validator: (value: String[]) => value.length >= 2,
      message: 'At least 2 users are required',
    },
  })
  user_ids: String[];

  @Prop({default: []})
  messages_ids: String[];

  readonly _id?: string;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
