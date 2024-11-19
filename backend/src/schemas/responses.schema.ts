import { Schema, model } from 'mongoose';

// Define the Response Schema
export const ResponseSchema = new Schema({
  responseId: {
    type: String,
    unique: true,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  quizId: {
    type: Schema.Types.ObjectId, // Using ObjectId to reference the Quiz schema
    ref: 'Quiz', // Refers to the "Quiz" model
    required: true,
  },
  answers: [
    {
      questionId: { type: String, required: true },
      answer: { type: String, required: true },
    },
  ],
  score: {
    type: Number,
    required: true,
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
});

// Define Model
export const Response = model('Response', ResponseSchema);
