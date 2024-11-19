import { Schema, model } from 'mongoose';

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

// Define Model
export const Quiz = model('Quiz', QuizSchema);
