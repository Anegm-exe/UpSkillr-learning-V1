import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';

export type NoteDocument = Note & Document;

@Schema()
export class Note {
  @Prop({ required: true , ref: 'User' })
  user_id: String;

  @Prop({ required: false , ref: 'Course' })
  course_id: String;

  @Prop({ required: true })
  content: string;

  @Prop({ default: Date.now })
  timestamp: Date;

  @Prop({ default: Date.now })
  last_updated: Date;
}

export const NoteSchema = SchemaFactory.createForClass(Note);
