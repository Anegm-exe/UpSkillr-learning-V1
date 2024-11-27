import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema()
export class Module {
  @Prop({ required: true , ref:'Course' })
  courseId: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({ default: [] })
  resources: string[];

  @Prop({ default: Date.now })
  timestamp: Date;
}

export const ModuleSchema = SchemaFactory.createForClass(Module);
