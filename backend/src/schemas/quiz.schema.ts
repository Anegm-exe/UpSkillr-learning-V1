import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';
import { Question } from './question.schema';

export type QuizDocument = Quiz & Document;

@Schema()
export class Quiz {
  @Prop({ required: true , ref: 'Module'})
  moduleId: Types.ObjectId;

  @Prop({ required: true })
  questions: Question[]

  @Prop({ default: Date.now })
  timestamp : Date;
}

export const QuizSchema = SchemaFactory.createForClass(Quiz);
