import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  userid: number;
  username: string;
  password: string;
  createdAt?: Date;
}

const UserSchema: Schema = new Schema({
  userid: { type: Number, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema); 