import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';

export type CourseDocument = Course & Document;

@Schema()
export class Course {
  @Prop({ required: true , ref: 'User'})
  Instructor_id: Types.ObjectId; 

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  category: string;

  @Prop({ required: true, enum: ['Beginner', 'Intermediate', 'Advanced'] })
  difficultyLevel: string;

  @Prop({ min: 0, max: 5, default: 0 })
  rating: number;

  @Prop({ default: Date.now })
  timestamp: Date;
}

export const CourseSchema = SchemaFactory.createForClass(Course);
