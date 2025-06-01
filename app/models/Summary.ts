import mongoose, { Schema, Document } from 'mongoose';

export interface ISummary extends Document {
  userid: number;
  videoUrl: string;
  timestamp: Date;
  summary: string[];
  flashcards: { question: string, answer: string }[];
  tldr: string[];
  lang: string;
  createdAt?: Date;
}

const SummarySchema: Schema = new Schema({
  userid: { type: Number, required: true },
  videoUrl: { type: String, required: true },
  timestamp: { type: Date, required: true },
  summary: { type: [String], required: true },
  flashcards: { type: [{ question: String, answer: String }], required: true },
  tldr: { type: [String], required: true },
  lang: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Summary || mongoose.model<ISummary>('Summary', SummarySchema);
