import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';

export type MessageDocument = Message & Document;

@Schema()
export class Message {
    @Prop({required: true , ref:'User'})
    user_id: String;

    @Prop({required:false , default:null , ref:'Message'})
    repliedTo_id: String; // Message_id not user_id

    @Prop({ minlength: 0, maxlength: 3000 })
    text: string;

    @Prop({default:Date.now})
    timestamp: Date;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
