import { Schema, model } from 'mongoose';

// Define the Form Schema
export const FormSchema = new Schema({
    userId: {
      type: String,
      unique: true,
      required: true,
    },
    courseId: {
      type: String,
      required: true,
    },
    instructorsId: {
      type: String,
      required: true,
    },
    messages: [
        {
            messageID: { type: String, required: true },
            Text: { type: String, required: true},
            DateTime: { type: Date, required: true},
            userId: { type: String, required: true },
        },
    ],
    replies: [
        {
            messageID: { type: String, required: true },
            Text: { type: String, required: true},
            DateTime: { type: Date, required: true},
            userId: { type: String, required: true },
        },
    ],
    createdOn: {
      type: Date,
      default: Date.now,
    },
  });

// Define Model
export const Form = model('Form', FormSchema);