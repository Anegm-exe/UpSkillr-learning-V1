import { Schema, Document } from 'mongoose';

// Define Schema
export const CourseSchema = new Schema({
    courseId: {
        type: String,
        unique: true,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    difficultyLevel: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Advanced'],
        required: true,
    },
    createdBy: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Define interface
export interface Course extends Document {
    courseId: string;
    title: string;
    description: string;
    category: string;
    difficultyLevel: 'Beginner' | 'Intermediate' | 'Advanced';
    createdBy: string;
    createdAt: Date;
}
