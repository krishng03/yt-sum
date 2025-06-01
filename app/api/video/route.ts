import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { saveSummary } from '../../services/summaryService';
import { getCurrentUser } from '../../../lib/auth';

// --------------- DO NOT TOUCH ---------------
// make .env file in root directory, add YOUTUBE_API_KEY and GEMINI_API_KEY as key-value pairs
const youtube = google.youtube({
  version: 'v3',
  auth: process.env.YOUTUBE_API_KEY
});
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Video ID Helper Function
function extractVideoId(url: string): string | null {
  return url.split('v=')[1] ?? '';
}

// Duration Helper Function
function formatDuration(duration: string): string {
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  if (!match) return '0:00';

  const hours = (match[1] || '').replace('H', '');
  const minutes = (match[2] || '').replace('M', '');
  const seconds = (match[3] || '').replace('S', '');

  let result = '';
  if (hours) result += `${hours}:`;
  result += `${minutes.padStart(2, '0')}:`;
  result += seconds.padStart(2, '0');
  
  return result;
}

// View Count Helper Function
function formatViews(viewCount: string): string {
  const count = parseInt(viewCount);
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  } else if (count >= 1000) {
    return `${(count / 1000).toFixed(2)}K`;
  }
  return viewCount;
}

// Published Date Helper Function
function formatPublishedAt(publishedAt: string): string {
  const date = new Date(publishedAt);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 1) return 'yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
}
// --------------- DO NOT TOUCH ---------------

export async function POST(request: Request) {
  try {
    // Check if API keys are available
    if (!process.env.YOUTUBE_API_KEY) {
      throw new Error('YouTube API key is not configured');
    }
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('Gemini API key is not configured');
    }

    // Get current user if logged in
    const currentUser = await getCurrentUser();

    const { url, language = 'en' } = await request.json();

    const videoId = extractVideoId(url);

    if (!videoId) {
      return NextResponse.json({ error: 'Invalid YouTube URL' }, { status: 400 });
    }

    try {
      // Get video details
      const videoResponse = await youtube.videos.list({
        part: ['snippet', 'contentDetails', 'statistics'],
        id: [videoId]
      });

      const video = videoResponse.data.items?.[0];
      if (!video) {
        return NextResponse.json({ error: 'Video not found' }, { status: 404 });
      }

      // Generate summary and flashcards using Gemini
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `
        Based on this YouTube video:
        Title: ${video.snippet?.title}
        Description: ${video.snippet?.description}
        
        Generate the response in ${language} language.
        
        Format your response EXACTLY as a JSON object with this structure:
        {
          "summary": string[],
          "flashcards": Array<{ question: string, answer: string }>,
          "tldr": string[]
        }`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      let generatedText = response.text();
      generatedText = generatedText.replace(/```json\n/, '').replace(/\n```/, '');
      let aiResponse;
      try {
        aiResponse = JSON.parse(generatedText);
      } catch (e) {
        console.error('Failed to parse Gemini response:', e);
        aiResponse = {
          summary: "Failed to generate summary",
          flashcards: []
        };
      }

      // Save to MongoDB only if user is logged in
      let savedToDB = false;
      
      if (currentUser && currentUser.userid) {
        try {
          const videoData = {
            title: video.snippet?.title || '',
            thumbnail: video.snippet?.thumbnails?.standard?.url || '',
            duration: formatDuration(video.contentDetails?.duration || ''),
            views: formatViews(video.statistics?.viewCount || '0'),
            publishedAt: formatPublishedAt(video.snippet?.publishedAt || ''),
            channelName: video.snippet?.channelTitle || ''
          };

          const summaryPayload = {
            userid: currentUser.userid,
            videoUrl: url,
            videoData: videoData,
            timestamp: new Date(),
            summary: aiResponse.summary,
            flashcards: aiResponse.flashcards,
            tldr: aiResponse.tldr,
            lang: language
          };

          await saveSummary(summaryPayload as any);
          savedToDB = true;
          console.log(`✅ Summary saved successfully for user ${currentUser.userid}`);
        } catch (error) {
          console.error('❌ Error saving summary to database:', error);
          // Don't throw error, just continue without saving
        }
      } else {
        console.log('❌ Summary not saved - user not logged in or invalid userid:', {
          hasCurrentUser: !!currentUser,
          userid: currentUser?.userid,
          reason: !currentUser ? 'No current user' : !currentUser.userid ? 'No userid' : 'Unknown'
        });
      }

      // Prepare response object
      const videoInfo = {
        url: url,
        title: video.snippet?.title,
        thumbnail: video.snippet?.thumbnails?.standard?.url,
        duration: formatDuration(video.contentDetails?.duration || ''),
        views: formatViews(video.statistics?.viewCount || '0'),
        publishedAt: formatPublishedAt(video.snippet?.publishedAt || ''),
        channelName: video.snippet?.channelTitle,
        summary: aiResponse.summary,
        flashcards: aiResponse.flashcards,
        tldr: aiResponse.tldr,
        savedToDB: savedToDB,
        isUserLoggedIn: !!currentUser && !!currentUser.userid
      };

      return NextResponse.json(videoInfo);

    } catch (error) {
      console.error('Error in API calls:', error);
      throw error;
    }

  } catch (error: any) {
    console.error('Error processing video:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process video' },
      { status: 500 }
    );
  }
} 