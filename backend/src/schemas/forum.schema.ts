import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';
import { Message } from './message.schema';

export type ForumDocument = Forum & Document;

@Schema()
export class Forum {
  @Prop({ required: true , ref:'Course'})
  courseId: Types.ObjectId;

  @Prop({ required: true , ref:'User'}) 
  user_id: Types.ObjectId;

  @Prop({ required: true })
  title: Message;

  @Prop({
    type: [Message],
    required: true,
    validate: {
      validator: (value: Message[]) => value.length >= 1,
      message: 'At least 1 Message for the form to be created !',
    },
  })
  messages: Message[];

  @Prop({ default: Date.now })
  timestamp: Date;
}

export const ForumSchema = SchemaFactory.createForClass(Forum);
