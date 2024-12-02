import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ModuleDocument = module & Document;

@Schema()
export class module {
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

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Content' }], required: true })
  contentIDs: Types.ObjectId[];

  readonly _id?: string;
}

export const ModuleSchema = SchemaFactory.createForClass(module);
