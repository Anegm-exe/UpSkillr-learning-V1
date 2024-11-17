import { Schema, Document } from 'mongoose';

// Define Schema
export const QuizSchema = new Schema({
    quizId: {
        type: String,
        unique: true,
        required: true,
    },
    moduleId: {
        type: Schema.Types.ObjectId, // Using ObjectId to reference the Module schema
        ref: 'Module', // Refers to the "Module" model
        required: true,
    },
    questions: [
        {
            questionText: { type: String, required: true },
            options: [{ type: String }], // Array of answer options
            correctAnswer: { type: String, required: true }, // The correct answer
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Define interface
export interface Quiz extends Document {
    quizId: string;
    moduleId: string; // This will be the ObjectId reference to a module
    questions: {
        questionText: string;
        options: string[];
        correctAnswer: string;
    }[];
    createdAt: Date;
}
