import { connectToDatabase } from '../../lib/mongodb';
import SummaryData from '../models/Summary';
import { IVideoData } from '../models/Summary';

export async function saveSummary(summaryData: {
  userid: number;
  videoUrl: string;
  videoData: IVideoData;
  timestamp: Date;
  summary: string[];
  flashcards: any[];
  tldr: string[];
  lang: string;
}) {
  try {
    await connectToDatabase();
    
    const newSummary = new SummaryData({
      userid: summaryData.userid,
      videoUrl: summaryData.videoUrl,
      videoData: summaryData.videoData,
      timestamp: summaryData.timestamp,
      summary: summaryData.summary,
      flashcards: summaryData.flashcards,
      tldr: summaryData.tldr,
      lang: summaryData.lang
    });

    return await newSummary.save();
  } catch (error) {
    console.error('❌ Error saving summary:', error);
    throw error;
  }
}

export async function getSummaries() {
  try {
    const { db } = await connectToDatabase();
    return await db
      .collection('summaries')
      .find()
      .sort({ createdAt: -1 })
      .toArray();
  } catch (error) {
    console.error('Error fetching summaries:', error);
    throw error;
  }
}

export async function getSummariesByUserId(userid: number) {
  try {
    await connectToDatabase();
    return await SummaryData
      .find({ userid })
      .sort({ createdAt: -1 });
  } catch (error) {
    console.error('Error fetching user summaries:', error);
    throw error;
  }
} 