import { Schema, model } from 'mongoose';

export const ContentSchema = new Schema({
    versions: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      urlArray: {
        type: [String],
        required: true,
      },
      createdAt: {
        type: Date,
        required: true,
      },
      latestAt: {
        type: Date,
        required: true,
      },
});

export const Content = model('Course', ContentSchema);
