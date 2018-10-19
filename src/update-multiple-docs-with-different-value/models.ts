import { model, Schema } from 'mongoose';

const collectionNamePrefix = 'update-multiple-docs-with-different-value';

const userSchema: Schema = new Schema(
  {
    name: String,
    age: Number
  },
  {
    collection: `${collectionNamePrefix}_users`
  }
);

const User = model('User', userSchema);

export { User };
