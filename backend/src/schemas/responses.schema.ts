import { Schema, Document } from 'mongoose';

// Define the Response Schema
export const ResponseSchema = new Schema({
    responseId: {
        type: String,
        unique: true,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
    quizId: {
        type: Schema.Types.ObjectId, // Using ObjectId to reference the Quiz schema
        ref: 'Quiz', // Refers to the "Quiz" model
        required: true,
    },
    answers: [
        {
            questionId: { type: String, required: true },
            answer: { type: String, required: true },
        },
    ],
    score: {
        type: Number,
        required: true,
    },
    submittedAt: {
        type: Date,
        default: Date.now,
    },
});

// Define the Response model interface
export interface Response extends Document {
    responseId: string;
    userId: string;
    quizId: string; // This will be the ObjectId reference to a quiz
    answers: { questionId: string; answer: string }[];
    score: number;
    submittedAt: Date;
}
