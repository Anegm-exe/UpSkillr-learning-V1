import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type QuizDocument = Quiz & Document;

@Schema()
export class Quiz {
  @Prop({ required: true, ref:'User'})
  user_id: string;

  @Prop({ required: true, ref:'Modules' })
  module_id: string

  @Prop({ required: true , enum:['mcq','truefalse','both']})
  type: string;

  @Prop({ required: true , ref: 'Question' })
  questions: string[];

  @Prop({ default: Date.now })
  timestamp : Date;

  readonly _id?: string;
}

export const QuizSchema = SchemaFactory.createForClass(Quiz);