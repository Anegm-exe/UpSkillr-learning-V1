import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';

export type QuestionsDocument = Questions & Document;

@Schema()
export class Questions {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  options: string[];

  @Prop({ required: true }) 
  answer: number;

  readonly _id?: string;
}

export const QuestionsSchema = SchemaFactory.createForClass(Questions);
