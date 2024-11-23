import { Schema, model } from 'mongoose';

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
  rating: {
    type: Number, 
    required: false,
    min: 0,
    max: 5,
    default: 0,
  }
  ,createdBy: {
    type: String, // Tutor id
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Define Model
export const Course = model('Course', CourseSchema);
