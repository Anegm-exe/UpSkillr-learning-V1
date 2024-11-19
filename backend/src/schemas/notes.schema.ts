import { Schema, model } from 'mongoose';

// Define Schema
export const NotesSchema = new Schema({
  noteId: {
    type: String,
    unique: true,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  courseId: {
    type: String,
    required: false,
  },
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

// Define Model
export const Notes = model('Notes', NotesSchema);
