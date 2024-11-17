import { Schema, Document } from 'mongoose';
export declare const ProgressSchema: Schema<any, import("mongoose").Model<any, any, any, any, any, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, {
    userId: string;
    courseId: string;
    progressId: string;
    completionPercentage: number;
    lastAccessed: NativeDate;
}, Document<unknown, {}, import("mongoose").FlatRecord<{
    userId: string;
    courseId: string;
    progressId: string;
    completionPercentage: number;
    lastAccessed: NativeDate;
}>> & import("mongoose").FlatRecord<{
    userId: string;
    courseId: string;
    progressId: string;
    completionPercentage: number;
    lastAccessed: NativeDate;
}> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
export interface Progress extends Document {
    progressId: string;
    userId: string;
    courseId: string;
    completionPercentage: number;
    lastAccessed: Date;
}
