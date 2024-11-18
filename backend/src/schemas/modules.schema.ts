import { Schema, Document } from 'mongoose';

// Define Schema
export const ModuleSchema = new Schema({
    moduleId: {
        type: String,
        unique: true,
        required: true,
    },
    courseId: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    resources: {
        type: [String],
        default: [],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Define Interface
export interface Module extends Document {
    moduleId: string;
    courseId: string;
    title: string;
    content: string;
    resources: string[];
    createdAt: Date;
}
