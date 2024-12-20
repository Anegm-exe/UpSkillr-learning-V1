import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ModuleDocument = Modules & Document;

@Schema()
export class Modules {
  @Prop({ required: true , ref:'Course' })
  course_id: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true, enum:['hard','medium','easy']})
  difficulty: string;

  @Prop({ default: [] })
  resources: string[];

  @Prop({ default: [], ref: 'Content' })
  content_ids: string[];

  @Prop({ required: true})
  no_question: number;

  @Prop({ required: true , enum:['mcq','truefalse','both']})
  type: string;

  @Prop({ default: [], ref:'Question'})
  question_bank: string[];

  @Prop({ default: [], ref:'Quiz'})
  quizzes: string[];
  
  @Prop({ default: Date.now })
  timestamp: Date;

  @Prop({ type:[Number],default:[], min:0, max:5 })
  ratings: number[];

  readonly _id?: string;
}

export const ModuleSchema = SchemaFactory.createForClass(Modules);
