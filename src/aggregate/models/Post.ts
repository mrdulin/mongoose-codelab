import * as mongoose from 'mongoose';

import { MongoConnect } from '../../db';

interface IPostStatic {
  findByAuthorName(this: mongoose.Model<IPost>, name: string): Promise<mongoose.Model<IPost>>;
}

interface IPost extends mongoose.Document, IPostStatic {
  title: string;
  author: string;
  body: string;
}

const postSchema: mongoose.Schema = new mongoose.Schema(
  {
    title: String,
    author: String,
    body: String
  },
  { collection: 'posts' }
);

const Post: mongoose.Model<IPost> = mongoose.model('Post', postSchema);

function findOneByAuthorName(this: mongoose.Model<IPost>, name: string): Promise<mongoose.Model<IPost>> {
  return new Promise((resolve, reject) => {
    Post.findOne({ author: name }, (err, post: mongoose.Model<IPost>) => {
      if (err) {
        return reject(err);
      }
      resolve(post);
    });
  });
}

function findTopAuthor(): Promise<any[]> {
  return Post.aggregate(
    [
      { $project: { author: 1 } },
      { $group: { _id: '$author', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ],
    (err: any, topAuthorResults: any[]) => {
      if (err) {
        return console.log(err);
      }
      return topAuthorResults;
    }
  );
}

postSchema.static({
  findOneByAuthorName,
  findTopAuthor
});

async function main() {
  await MongoConnect();

  // try {
  //   const post: mongoose.Model<IPost> = await Post.schema.statics.findOneByAuthorName('Mohammed.Robel');
  //   console.log('post: ', post);
  // } catch (error) {
  //   console.log(error);
  // }

  try {
    const topAuthorResults: any[] = await Post.schema.statics.findTopAuthor();
    console.log(topAuthorResults);
  } catch (error) {
    console.log(error);
  }

  process.exit();
}

main();

export { Post };
