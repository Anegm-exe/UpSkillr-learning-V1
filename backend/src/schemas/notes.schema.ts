import { Schema, Document } from 'mongoose';

// Define Schema
export const NotesSchema = new Schema({
    noteId: {
        type: String,
        unique: true,
        required: true,
    },
    userId: {
        type: String, // This could reference the User schema
        required: true,
    },
    courseId: {
        type: String, // This could reference the Course schema (optional "Maybe its a General note msln!")
        required: false,
    },
    content: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now, // Automatically set to current date/time when created
    },
    lastUpdated: {
        type: Date,
        default: Date.now, // Automatically set to current date/time when created or updated
    },
});

// Define interface
export interface Notes extends Document {
    noteId: string;
    userId: string;
    courseId?: string; // Optional
    content: string;
    createdAt: Date;
    lastUpdated: Date;
}
