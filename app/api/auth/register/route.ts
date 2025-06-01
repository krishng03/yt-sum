import { NextResponse } from 'next/server';
import { createUser } from '../../../services/userService';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    const user = await createUser(username, password);
    
    return NextResponse.json({
      message: 'User created successfully',
      user: {
        userid: user.userid,
        username: user.username
      }
    });

  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create user' },
      { status: 500 }
    );
  }
} 