import { Schema, model } from 'mongoose';
// Define the schema
export const NotificationsSchema = new Schema({
    userId: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    Sender_id: {
      type: String,
      required: false,
    },
    DateTime: {
      type: Date,
      default: Date.now,
    },
  });

  // Define the model
  export const Notifications = model('Notifications', NotificationsSchema);