import { Schema, model } from 'mongoose';

export const ProgressSchema = new Schema({
  progressId: {
    type: String,
    unique: true,
    required: true,
  },
  userId: {
    type: String, 
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
  averageQuiz:{
    type:Number,
    required:false,
    default:0,
  },
  openedTimes:{
    type:Number,
    required:false,
    default:0,
  }
});

// Define the Progress model
export const Progress = model('Progress', ProgressSchema);
