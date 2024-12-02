import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Message } from './message.schema';

export type ForumDocument = Forum & Document;

@Schema()
export class Forum {
  @Prop({ required: true , ref:'Course'})
  course_id: string;

  @Prop({ required: true , ref:'User'}) 
  user_id: string;

  @Prop({ required: true })
  title: string;

  @Prop({
    type: [String],
    required: true,
   
  })
  messages: string[];

  @Prop({ default: Date.now })
  timestamp: Date;

  readonly _id?: string;
}

export const ForumSchema = SchemaFactory.createForClass(Forum);
