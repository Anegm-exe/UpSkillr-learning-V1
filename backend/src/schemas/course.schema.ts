import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';

export type CourseDocument = Course & Document;

@Schema()
export class Course {
  @Prop({ required: true , ref: 'User'})
  instructor_id: string; 

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  category: string;

  @Prop({ required: true, enum: ['Beginner', 'Intermediate', 'Advanced'] })
  difficulty_Level: string;

  @Prop({ min: 0, max: 5, default: 0 })
  rating: number;

  @Prop({ default: Date.now })
  timestamp: Date;

  readonly _id?: string;
}

export const CourseSchema = SchemaFactory.createForClass(Course);
