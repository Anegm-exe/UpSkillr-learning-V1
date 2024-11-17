import { Schema, Document } from 'mongoose';
export declare const ModuleSchema: Schema<any, import("mongoose").Model<any, any, any, any, any, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, {
    createdAt: NativeDate;
    courseId: string;
    title: string;
    moduleId: string;
    content: string;
    resources: string[];
}, Document<unknown, {}, import("mongoose").FlatRecord<{
    createdAt: NativeDate;
    courseId: string;
    title: string;
    moduleId: string;
    content: string;
    resources: string[];
}>> & import("mongoose").FlatRecord<{
    createdAt: NativeDate;
    courseId: string;
    title: string;
    moduleId: string;
    content: string;
    resources: string[];
}> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
export interface Module extends Document {
    moduleId: string;
    courseId: string;
    title: string;
    content: string;
    resources: string[];
    createdAt: Date;
}
