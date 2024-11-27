import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Message } from './message.schema';

@Schema()
export class Chat {
  @Prop({ required: true })
  name: string;

  @Prop({
    type: [Types.ObjectId],
    ref: 'User',
    required: true,
    validate: {
      validator: (value: Types.ObjectId[]) => value.length >= 2,
      message: 'At least 2 users are required',
    },
  })
  User_Ids: Types.ObjectId[];

  @Prop({default: []})
  messages: Message[];
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
