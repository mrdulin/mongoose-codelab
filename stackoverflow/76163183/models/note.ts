import mongoose from "mongoose";

export const NoteSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    text: { type: String, required: true },
  },
  { timestamps: true }
);

export const NoteModel = mongoose.model("note", NoteSchema);


