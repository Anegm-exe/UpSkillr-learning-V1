import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProgressDocument = Progress & Document;

@Schema()
export class Progress {
  @Prop({ required: true , ref: 'User'})
  user_id: string;

  @Prop({ required: true , ref: 'Course'})
  course_id: string;

  @Prop({ default: 0, min: 0, max: 100 })
  completion_percentage: number;

  @Prop({ default: Date.now })
  last_accessed: Date;

  @Prop({ default: [] })
  completed_modules: { module_id: string, score: number}[];

  @Prop({ required: false })
  average_quiz: number;

  @Prop({ default: 0 })
  opened_times: number;

  readonly _id?: string;
}

export const ProgressSchema = SchemaFactory.createForClass(Progress);
