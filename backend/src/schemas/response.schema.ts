import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';

export type ResponseDocument = Response & Document;

@Schema()
export class Response{
  @Prop({ required: true })
  user_id: String;

  @Prop({ required: true, ref: 'Quiz' })
  quiz_id: String;

  @Prop({ required: true })
  answers: {questionId: String; answer: string}[];

  @Prop({ required: true })
  score: number;

  @Prop({ default: Date.now })
  timestamp: Date;
}

export const ResponseSchema = SchemaFactory.createForClass(Response);
