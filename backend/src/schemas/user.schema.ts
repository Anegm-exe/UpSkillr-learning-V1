import { Schema, Document } from 'mongoose';

export interface User extends Document {
    userId: string;
    name: string;
    email: string;
    passwordHash: string;
    role: 'student' | 'instructor' | 'admin'; // ROLE ENUM :P
    profilePictureUrl?: string; // Optional
    createdAt: Date;
}

// Defining schema
export const UserSchema = new Schema<User>(
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

