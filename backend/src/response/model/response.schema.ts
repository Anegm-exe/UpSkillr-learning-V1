import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';

export type ResponseDocument = Response & Document;

@Schema()
export class Response{
  @Prop({ required: true, ref: 'User' })
  user_id: string;

  @Prop({ required: true, ref: 'Quiz' })
  quiz_id: string;

  @Prop({ required: true })
  answers: {question_id: string; answer: number}[];

  @Prop({ required: false })
  correctAnswers: {question_id: string; answer: number}[];

  @Prop({ default: 0 })
  score: number;

  @Prop({ default: Date.now })
  timestamp: Date;

  readonly _id?: string;
}

export const ResponseSchema = SchemaFactory.createForClass(Response);
