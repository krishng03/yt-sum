import { connectToDatabase } from '../../lib/mongodb';
import User from '../models/User';

export async function createUser(username: string, password: string) {
  try {
    await connectToDatabase();
    
    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      throw new Error('Username already exists');
    }

    // Get the next userid
    const lastUser = await User.findOne().sort({ userid: -1 });
    const nextUserid = lastUser ? lastUser.userid + 1 : 1;

    const newUser = new User({
      userid: nextUserid,
      username,
      password
    });

    return await newUser.save();
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

export async function validateUser(username: string, password: string) {
  try {
    await connectToDatabase();
    
    const user = await User.findOne({ username });
    if (!user) {
      throw new Error('User not found');
    }

    if (user.password !== password) {
      throw new Error('Invalid password');
    }

    return {
      userid: user.userid,
      username: user.username
    };
  } catch (error) {
    console.error('Error validating user:', error);
    throw error;
  }
}

export async function getUserByUserid(userid: number) {
  try {
    await connectToDatabase();
    
    const user = await User.findOne({ userid }).select('-password');
    return user;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
} 