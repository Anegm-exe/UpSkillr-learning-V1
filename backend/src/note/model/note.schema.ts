import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type NoteDocument = Note & Document;

@Schema()
export class Note {
  @Prop({ required: true , ref: 'User' })
  user_id: string;

  @Prop({ required: false , ref: 'Course' })
  course_id: string;

  @Prop({ required: true })
  content: string;

  @Prop({ default: Date.now })
  timestamp: Date;

  @Prop({ default: Date.now })
  last_updated: Date;

  readonly _id?: string;
}

export const NoteSchema = SchemaFactory.createForClass(Note);
