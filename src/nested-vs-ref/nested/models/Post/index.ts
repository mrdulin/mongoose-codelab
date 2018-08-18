import { Model, Schema, model, Document } from 'mongoose';

interface IPost<Comment> {
  author: string;
  content: string;
  createdAt: Date;
  comments: Comment[];
}

type IPostModel = IPost<IComment> & Document;

interface IComment {
  author: string;
  content: string;
  date: Date;
}

const PostSchema: Schema = new Schema(
  {
    id: Schema.Types.ObjectId,
    author: String,
    content: String,
    createdAt: Date,
    comments: [{ id: Schema.Types.ObjectId, author: String, content: String, date: { type: Date, default: Date.now } }]
  },
  {
    collection: 'postNested'
  }
);

const Post: Model<IPostModel> = model<IPostModel>('Post', PostSchema);

export { Post, IPost, IComment };
