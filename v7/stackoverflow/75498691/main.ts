import mongoose from "mongoose";

interface User {
  email: string;
  password: string;
}
const userSchema = new mongoose.Schema<User>({
  email: String,
  password: String
})

userSchema.pre('save', async function (next) {
  let user = this;
  if (!user.isModified("password")) return next();
  return next();
})