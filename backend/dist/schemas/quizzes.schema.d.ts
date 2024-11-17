import { Schema, Document } from 'mongoose';
export declare const QuizSchema: Schema<any, import("mongoose").Model<any, any, any, any, any, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, {
    createdAt: NativeDate;
    moduleId: import("mongoose").Types.ObjectId;
    quizId: string;
    questions: import("mongoose").Types.DocumentArray<{
        questionText: string;
        options: string[];
        correctAnswer: string;
    }>;
}, Document<unknown, {}, import("mongoose").FlatRecord<{
    createdAt: NativeDate;
    moduleId: import("mongoose").Types.ObjectId;
    quizId: string;
    questions: import("mongoose").Types.DocumentArray<{
        questionText: string;
        options: string[];
        correctAnswer: string;
    }>;
}>> & import("mongoose").FlatRecord<{
    createdAt: NativeDate;
    moduleId: import("mongoose").Types.ObjectId;
    quizId: string;
    questions: import("mongoose").Types.DocumentArray<{
        questionText: string;
        options: string[];
        correctAnswer: string;
    }>;
}> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
export interface Quiz extends Document {
    quizId: string;
    moduleId: string;
    questions: {
        questionText: string;
        options: string[];
        correctAnswer: string;
    }[];
    createdAt: Date;
}
