import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema()
export class Progress {
  @Prop({ required: true , ref: 'User'})
  userId: Types.ObjectId;

  @Prop({ required: true , ref: 'Course'})
  courseId: Types.ObjectId;

  @Prop({ required: true, min: 0, max: 100 })
  completionPercentage: number;

  @Prop({ default: Date.now })
  lastAccessed: Date;

  @Prop({ required: false, default: 0 })
  averageQuiz: number;

  @Prop({ required: false, default: 0 })
  openedTimes: number;
}

export const ProgressSchema = SchemaFactory.createForClass(Progress);
