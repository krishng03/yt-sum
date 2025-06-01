import { NextResponse } from 'next/server';
import { getCurrentUser } from '../../../lib/auth';
import { getSummariesByUserId } from '../../services/summaryService';

export async function GET() {
  try {
    // Get current user
    const currentUser = await getCurrentUser();
    
    if (!currentUser) {
      return NextResponse.json(
        { error: 'User not logged in' },
        { status: 401 }
      );
    }

    // Get user's summaries
    const summaries = await getSummariesByUserId(currentUser.userid);
    
    return NextResponse.json({
      user: currentUser,
      summaries: summaries
    });

  } catch (error: any) {
    console.error('Error fetching history:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch history' },
      { status: 500 }
    );
  }
} 