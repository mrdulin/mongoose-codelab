import { Document, model, Model, Schema } from 'mongoose';

const collectionNamePrefix: string = 'join_multiple-collections';

interface IUser extends Document {
  name: string;
  orgId: string;
}

interface IBookTemplate extends Document {
  title: string;
  orgId: string;
}

interface IBook extends Document {
  title: string;
  bookTemplateId: string;
}

interface IBookResult extends Document {
  clicks: number;
  bookId: string;
}

const userSchema: Schema = new Schema(
  {
    name: String,
    orgId: Schema.Types.ObjectId
  },
  { collection: `${collectionNamePrefix}_users` }
);

const bookTemplateSchema: Schema = new Schema(
  {
    title: String,
    orgId: Schema.Types.ObjectId
  },
  {
    collection: `${collectionNamePrefix}_bookTemplates`
  }
);

const bookSchema: Schema = new Schema(
  {
    title: String,
    bookTemplateId: Schema.Types.ObjectId
  },
  {
    collection: `${collectionNamePrefix}_books`
  }
);

const bookResultSchema: Schema = new Schema(
  {
    clicks: Number,
    bookId: Schema.Types.ObjectId
  },
  {
    collection: `${collectionNamePrefix}_bookResults`
  }
);

const User: Model<IUser> = model<IUser>('User', userSchema);
const BookTemplate: Model<IBookTemplate> = model<IBookTemplate>('BookTemplate', bookTemplateSchema);
const Book: Model<IBook> = model<IBook>('Book', bookSchema);
const BookResult: Model<IBookResult> = model<IBookResult>('BookResult', bookResultSchema);

export { User, BookTemplate, Book, BookResult, collectionNamePrefix };
