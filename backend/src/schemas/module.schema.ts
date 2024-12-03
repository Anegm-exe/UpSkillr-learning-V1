import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ModuleDocument = Modules & Document;

@Schema()
export class Modules {
  @Prop({ required: true , ref:'Course' })
  course_id: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({ default: [] })
  resources: string[];

  @Prop({ default: Date.now })
  timestamp: Date;

  @Prop({ ref: 'Content', required: true })
  contentIDs: string[];

  readonly _id?: string;
}

export const ModuleSchema = SchemaFactory.createForClass(Modules);
