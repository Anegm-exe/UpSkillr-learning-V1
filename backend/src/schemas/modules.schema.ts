import { Schema, model } from 'mongoose';

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

// Define Model
export const Module = model('Module', ModuleSchema);
