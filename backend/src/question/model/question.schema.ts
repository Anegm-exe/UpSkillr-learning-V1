import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';

export type QuestionsDocument = Questions & Document;

@Schema()
export class Questions {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true , enum:['mcq','truefalse']})
  type: string;

  @Prop({ required: true })
  options: string[];

  @Prop({ required: true }) 
  answer: number;

  @Prop({ required: true, enum:['hard','medium','easy']})
  difficulty: string;

  readonly _id?: string;
}

export const QuestionsSchema = SchemaFactory.createForClass(Questions);
