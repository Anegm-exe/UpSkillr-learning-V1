import { Schema, model } from 'mongoose';

const AuthenticationLogsSchema = new Schema({
  logId: {
    type: String,
    unique: true,
    required: true,
  },
  userId: {
    type: String, // This could reference the User schema
    required: true,
  },
  event: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now, // Automatically set to current date/time when the log is created
  },
  status: {
    type: String,
    enum: ['Success', 'Failure'], // Limit possible values for status
    required: true,
  },
});

// Define the Authentication Logs model interface
const AuthenticationLogs = model('AuthenticationLogs', AuthenticationLogsSchema);

export { AuthenticationLogs, AuthenticationLogsSchema };
