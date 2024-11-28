import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';
import { Message } from './message.schema';

export type ForumDocument = Forum & Document;

@Schema()
export class Forum {
  @Prop({ required: true , ref:'Course'})
  course_id: String;

  @Prop({ required: true , ref:'User'}) 
  user_id: String;

  @Prop({ required: true })
  title: Message;

  @Prop({
    type: [String],
    required: true,
    validate: {
      validator: (value: Message[]) => value.length >= 1,
      message: 'At least 1 Message for the form to be created !',
    },
  })
  messages: String[];

  @Prop({ default: Date.now })
  timestamp: Date;
}

export const ForumSchema = SchemaFactory.createForClass(Forum);
