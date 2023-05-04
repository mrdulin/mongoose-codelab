import mongoose, { Schema, Document } from "mongoose";
import bcrypt from 'bcrypt'

export interface UserDocument extends Document {
  email: string;
  name: string;
  password: string;
}

const UserSchema = new Schema<UserDocument>({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true },
  password: { type: String, required: true, trim: true }
});

UserSchema.pre('save', async function (next) {
  console.log('Save pre hook called!!!')
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  console.log(user.password);
  next();
})

export const User = mongoose.model('Users', UserSchema);