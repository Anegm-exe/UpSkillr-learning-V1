import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type ContentDocument = Content & Document;

@Schema()
export class Content {
  @Prop({ required: true })
  versions: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  url_array: string[];

  @Prop({ required: true })
  timestamp: Date;

  @Prop({ required: true })
  latest_at: Date;
}

export const ContentSchema = SchemaFactory.createForClass(Content);
