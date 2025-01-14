import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CourseDocument = Course & Document;

@Schema()
export class Course {
  @Prop({ required: true , ref: 'User'})
  instructor_ids: string[]; //each course can have more than one instructor, ex. ML has dr.caroline ,sandra and nouran ?

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ default:[] })
  category: string[];

  @Prop({ required: true, enum: ['Beginner', 'Intermediate', 'Advanced'] })
  difficulty_Level: string;

  @Prop({ min: 0, max: 5, required:false })
  rating: number;

  @Prop({ default: Date.now })
  timestamp: Date;

  @Prop({ default: [], ref: "User" })
  students: string[]; //each course can have more than one student

  @Prop({ default: [],ref: "Module" })
  modules: string[]; //each course can have more than one module

  @Prop({ default:false })
  isArchived: boolean;
  
  readonly _id?: string;
}

export const CourseSchema = SchemaFactory.createForClass(Course);
