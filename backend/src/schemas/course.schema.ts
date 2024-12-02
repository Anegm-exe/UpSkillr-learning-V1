import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';

export type CourseDocument = Course & Document;

@Schema()
export class Course {
  @Prop({ required: true , ref: 'User'})
  instructor_ids: string[]; //each course can have more than one instructor, ex. ML has dr.caroline ,sandra and nouran ?

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

  @Prop({ required: true, ref: "User" })
  students: string[]; //each course can have more than one student

  @Prop({ required: true,ref: "Module" })
  modules: string[]; //each course can have more than one module

  @Prop({ required: true, ref: "Quiz" })
  quizzes: string[]; //each course can have more than one quiz

  readonly _id?: string;
}

export const CourseSchema = SchemaFactory.createForClass(Course);
