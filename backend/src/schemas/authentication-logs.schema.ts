import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types, Document } from "mongoose";

export type AuthenticationLogDocument = AuthenticationLog & Document;

@Schema()
export class AuthenticationLog {
  @Prop({ required: true , ref:'User'})
  userId: Types.ObjectId;

  @Prop({ required: true })
  event: string;

  @Prop({ default: Date.now })
  timestamp: Date;

  @Prop({ required: true, enum: ['Success', 'Failure'] })
  status: string;
}

export const AuthenticationLogSchema = SchemaFactory.createForClass(AuthenticationLog);
