import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema({
  content: String,
});

export default mongoose.model('comment', CommentSchema);