import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';

export type ModuleDocument = Module & Document;

@Schema()
export class Module {
  @Prop({ required: true })
  moduleId: String;

  @Prop({ required: true , ref:'Course' })
  course_id: String;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({ default: [] })
  resources: string[];

  @Prop({ default: Date.now })
  timestamp: Date;

  readonly _id?: string;
}

export const ModuleSchema = SchemaFactory.createForClass(Module);
