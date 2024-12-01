import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User  {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;


  @Prop({ required: true })
  password_hash: string;

  @Prop({ required: true, unique: true })
  dataOfBirth: Date;

  @Prop({ required: true, enum: ['student', 'instructor', 'admin'] })
  role: string;

  @Prop({ required: false, default: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png'})
  profile_picture_url: string;

  readonly _id?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);