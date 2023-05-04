import mongoose from "mongoose";
import { NoteSchema } from "./note";

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    notes: [NoteSchema],
  },
  { timestamps: true }
);

export const UserModel = mongoose.model("user", UserSchema);

