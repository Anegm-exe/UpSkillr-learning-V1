import { Schema, Document } from 'mongoose';

// Define the Progress Schema
export const ProgressSchema = new Schema({
    progressId: {
        type: String,
        unique: true,
        required: true,
    },
    userId: {
        type: String, // This could be a reference to the User model
        required: true,
    },
    courseId: {
        type: String, // This could be a reference to the Course model
        required: true,
    },
    completionPercentage: {
        type: Number, // Represents the completion percentage (0-100)
        required: true,
        min: 0,
        max: 100,
    },
    lastAccessed: {
        type: Date,
        default: Date.now, // This will automatically set to the current date and time
    },
});

// Define the Progress model interface
export interface Progress extends Document {
    progressId: string;
    userId: string;
    courseId: string;
    completionPercentage: number;
    lastAccessed: Date;
}
