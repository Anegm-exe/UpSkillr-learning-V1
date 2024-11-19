import { Schema, model } from 'mongoose';

// Define Schema
export const UserSchema = new Schema(
  {
    userId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: { type: String, required: true, enum: ['student', 'instructor', 'admin'] },
    profilePictureUrl: { type: String, required: false },
  },
  { timestamps: { createdAt: 'createdAt' } }
);

// Define Model
export const User = model('User', UserSchema);
