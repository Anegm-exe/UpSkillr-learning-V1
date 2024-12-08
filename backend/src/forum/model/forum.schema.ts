import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ForumDocument = Forum & Document;

@Schema()
export class Forum {
  @Prop({ required: true , ref:'Course'})
  course_id: string;

  @Prop({ required: true , ref:'User'}) 
  user_id: string;

  @Prop({ required: true })
  title: string;

  @Prop({ default: [], ref: 'Message'})
  messages: string[];

  @Prop({ default: Date.now })
  timestamp: Date;

  readonly _id?: string;
}

export const ForumSchema = SchemaFactory.createForClass(Forum);
