import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type ContentDocument = Content & Document;
export type FileVersionDocument = FileVersion & Document;

@Schema()
export class FileVersion {
  @Prop({ required: true })
  version: number;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  url: string;

  @Prop({ required: true })
  desc: string;

  @Prop({ required: true })
  createdAt: Date;
}

export const FileVersionSchema = SchemaFactory.createForClass(FileVersion);

@Schema()
export class Content {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  currentVersion: number;

  @Prop({ type: [FileVersionSchema], required: true })
  versions: FileVersion[];
}

export const ContentSchema = SchemaFactory.createForClass(Content);
