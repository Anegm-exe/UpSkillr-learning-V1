import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';

export type QuestionDocument = Question & Document;

@Schema()
export class Question {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  options: String[];

  @Prop({ required: true }) 
  answer: number;

  readonly _id?: string;
}

export const QuestionSchema = SchemaFactory.createForClass(Question);
