import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';

export type ResponseDocument = Response & Document;

@Schema()
export class Response{
  @Prop({ required: true })
  userId: Types.ObjectId;

  @Prop({ required: true, ref: 'Quiz' })
  quizId: Types.ObjectId;

  @Prop({ required: true })
  answers: {questionId: Types.ObjectId; answer: string}[];

  @Prop({ required: true })
  score: number;

  @Prop({ default: Date.now })
  timestamp: Date;
}

export const ResponseSchema = SchemaFactory.createForClass(Response);
