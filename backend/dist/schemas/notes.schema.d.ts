import { Schema, Document } from 'mongoose';
export declare const NotesSchema: Schema<any, import("mongoose").Model<any, any, any, any, any, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, {
    userId: string;
    createdAt: NativeDate;
    content: string;
    noteId: string;
    lastUpdated: NativeDate;
    courseId?: string;
}, Document<unknown, {}, import("mongoose").FlatRecord<{
    userId: string;
    createdAt: NativeDate;
    content: string;
    noteId: string;
    lastUpdated: NativeDate;
    courseId?: string;
}>> & import("mongoose").FlatRecord<{
    userId: string;
    createdAt: NativeDate;
    content: string;
    noteId: string;
    lastUpdated: NativeDate;
    courseId?: string;
}> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
export interface Notes extends Document {
    noteId: string;
    userId: string;
    courseId?: string;
    content: string;
    createdAt: Date;
    lastUpdated: Date;
}
