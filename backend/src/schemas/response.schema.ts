import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';

export type ResponseDocument = Response & Document;

@Schema()
export class Response{
  @Prop({ required: true, ref: 'User' })
  user_id: String;

  @Prop({ required: true, ref: 'Quiz' })
  quiz_id: String;

  @Prop({ required: true })
  answers: {questionId: String; answer: number}[];

  @Prop({ default: 0 })
  score: number;

  @Prop({ default: Date.now })
  timestamp: Date;

  readonly _id?: string;
}

export const ResponseSchema = SchemaFactory.createForClass(Response);
