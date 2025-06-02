import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '../../../../lib/mongodb';
import Summary from '@/app/models/Summary';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const videoUrl = url.searchParams.get('videoUrl');

    if (!videoUrl) {
      return NextResponse.json({ error: 'Video URL is required' }, { status: 400 });
    }

    await connectToDatabase();
    const summary = await Summary.findOne({ videoUrl }).select('videoData.notes');

    return NextResponse.json({ 
      notes: summary?.videoData?.notes || '' 
    });
  } catch (error) {
    console.error('Error fetching notes:', error);
    return NextResponse.json({ error: 'Failed to fetch notes' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { videoUrl, notes } = await request.json();

    if (!videoUrl) {
      return NextResponse.json({ error: 'Video URL is required' }, { status: 400 });
    }

    await connectToDatabase();
    
    const summary = await Summary.findOne({ videoUrl });
    if (!summary) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 });
    }

    // Update notes
    summary.videoData.notes = notes;
    summary.markModified('videoData.notes');
    await summary.save();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving notes:', error);
    return NextResponse.json({ error: 'Failed to save notes' }, { status: 500 });
  }
} 