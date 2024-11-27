import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema()
export class Question {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  options: String[];

  @Prop({ required: true }) 
  answer: String;
}

export const QuestionSchema = SchemaFactory.createForClass(Question);
