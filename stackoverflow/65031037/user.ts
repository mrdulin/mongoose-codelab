import { Document, Schema, model } from 'mongoose';

interface IUser extends Document {
  email: string;
  password: string;
  strategy: string;
  userId: string;
  isValidPassword(password: string): boolean;
}

const userSchema = new Schema({
  strategy: {
    type: String,
    enum: ['local', 'facebook', 'google'],
  },
  email: {
    type: String,
    lowercase: true,
  },
  password: {
    type: String,
  },
  userId: {
    type: String,
  },
});
const User = model<IUser>('user', userSchema);

export { User, IUser };
