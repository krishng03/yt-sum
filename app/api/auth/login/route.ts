import { NextResponse } from 'next/server';
import { validateUser } from '../../../services/userService';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    const user = await validateUser(username, password);
    
    // Create a simple session by setting a cookie
    const response = NextResponse.json({
      message: 'Login successful',
      user: {
        userid: user.userid,
        username: user.username
      }
    });

    // Set session cookie (simple approach)
    response.cookies.set('session', JSON.stringify({
      userid: user.userid,
      username: user.username
    }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 86400 // 24 hours
    });

    return response;

  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: error.message || 'Invalid credentials' },
      { status: 401 }
    );
  }
} 