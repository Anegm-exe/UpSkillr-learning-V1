import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Message } from './message.schema';

export type ForumDocument = Forum & Document;

@Schema()
export class Forum {
  @Prop({ required: true, ref: 'Course' })
  course_id: string;

  @Prop({ required: true, ref: 'User' })
  user_id: string;

  @Prop({ required: true })
  title: Message;

  @Prop({
    type: [String],
    required: true,
    validate: {
      validator: (value: Message[]) => value.length >= 1,
      message: 'At least 1 Message for the forum to be created !',
    },
  })
  messages: string[];

  @Prop({ default: Date.now })
  timestamp: Date;

  readonly _id?: string;
}

export const ForumSchema = SchemaFactory.createForClass(Forum);
