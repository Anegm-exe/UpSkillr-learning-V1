import { Schema, Document } from 'mongoose';
export declare const ResponseSchema: Schema<any, import("mongoose").Model<any, any, any, any, any, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, {
    userId: string;
    quizId: import("mongoose").Types.ObjectId;
    responseId: string;
    answers: import("mongoose").Types.DocumentArray<{
        questionId: string;
        answer: string;
    }>;
    score: number;
    submittedAt: NativeDate;
}, Document<unknown, {}, import("mongoose").FlatRecord<{
    userId: string;
    quizId: import("mongoose").Types.ObjectId;
    responseId: string;
    answers: import("mongoose").Types.DocumentArray<{
        questionId: string;
        answer: string;
    }>;
    score: number;
    submittedAt: NativeDate;
}>> & import("mongoose").FlatRecord<{
    userId: string;
    quizId: import("mongoose").Types.ObjectId;
    responseId: string;
    answers: import("mongoose").Types.DocumentArray<{
        questionId: string;
        answer: string;
    }>;
    score: number;
    submittedAt: NativeDate;
}> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
export interface Response extends Document {
    responseId: string;
    userId: string;
    quizId: string;
    answers: {
        questionId: string;
        answer: string;
    }[];
    score: number;
    submittedAt: Date;
}
