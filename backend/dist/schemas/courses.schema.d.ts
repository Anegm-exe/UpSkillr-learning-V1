import { Schema, Document } from 'mongoose';
export declare const CourseSchema: Schema<any, import("mongoose").Model<any, any, any, any, any, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, {
    createdAt: NativeDate;
    description: string;
    courseId: string;
    title: string;
    category: string;
    difficultyLevel: "Beginner" | "Intermediate" | "Advanced";
    createdBy: string;
}, Document<unknown, {}, import("mongoose").FlatRecord<{
    createdAt: NativeDate;
    description: string;
    courseId: string;
    title: string;
    category: string;
    difficultyLevel: "Beginner" | "Intermediate" | "Advanced";
    createdBy: string;
}>> & import("mongoose").FlatRecord<{
    createdAt: NativeDate;
    description: string;
    courseId: string;
    title: string;
    category: string;
    difficultyLevel: "Beginner" | "Intermediate" | "Advanced";
    createdBy: string;
}> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
export interface Course extends Document {
    courseId: string;
    title: string;
    description: string;
    category: string;
    difficultyLevel: 'Beginner' | 'Intermediate' | 'Advanced';
    createdBy: string;
    createdAt: Date;
}
