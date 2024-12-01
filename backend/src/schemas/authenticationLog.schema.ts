import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type AuthenticationLogDocument = AuthenticationLog & Document;

@Schema()
export class AuthenticationLog {
  @Prop({ required: true , ref:'User'})
  user_id: string;

  @Prop({ required: true })
  event: string;

  @Prop({ default: Date.now })
  timestamp: Date;

  @Prop({ required: true, enum: ['Success', 'Failure'] })
  status: string;

  readonly _id?: string;
}

export const AuthenticationLogSchema = SchemaFactory.createForClass(AuthenticationLog);
