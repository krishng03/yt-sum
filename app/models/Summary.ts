import mongoose, { Schema, Document } from 'mongoose';

export interface IVideoData {
  title: string;
  thumbnail: string;
  duration: string;
  views: string;
  publishedAt: string;
  channelName: string;
}

export interface ISummary extends Document {
  userid: number;
  videoUrl: string;
  videoData: IVideoData;
  timestamp: Date;
  summary: string[];
  flashcards: { question: string, answer: string }[];
  tldr: string[];
  lang: string;
  createdAt?: Date;
}

const VideoDataSchema = new Schema({
  title: { type: String, required: true },
  thumbnail: { type: String, required: true },
  duration: { type: String, required: true },
  views: { type: String, required: true },
  publishedAt: { type: String, required: true },
  channelName: { type: String, required: true }
}, { _id: false });

const SummarySchema: Schema = new Schema({
  userid: { type: Number, required: true },
  videoUrl: { type: String, required: true },
  videoData: { type: VideoDataSchema, required: true },
  timestamp: { type: Date, required: true },
  summary: { type: [String], required: true },
  flashcards: { type: [{ question: String, answer: String }], required: true },
  tldr: { type: [String], required: true },
  lang: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Summary || mongoose.model<ISummary>('Summary', SummarySchema);
