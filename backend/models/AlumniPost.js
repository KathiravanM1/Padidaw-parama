import { Schema, model } from 'mongoose';

const AlumniPostSchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['job_offer', 'placement_tip', 'document'],
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    trim: true,
  },
  // For job_offer
  company: { type: String, trim: true },
  role: { type: String, trim: true },
  package: { type: String, trim: true },
  location: { type: String, trim: true },
  applyLink: { type: String, trim: true },
  // For document
  fileUrl: { type: String },
  fileName: { type: String },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default model('AlumniPost', AlumniPostSchema);
