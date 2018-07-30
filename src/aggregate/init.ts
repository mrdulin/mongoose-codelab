import * as casual from 'casual';
import * as mongoose from 'mongoose';

import { Post } from './models/Post';
import { MongoConnect } from '../db';

const metaDatas = [
  {
    author: casual.username,
    count: 12
  },
  {
    author: casual.username,
    count: 23
  },
  {
    author: casual.username,
    count: 17
  }
];

async function main(metas: any[] = metaDatas): Promise<mongoose.Mongoose | undefined> {
  const conn: mongoose.Mongoose | undefined = await MongoConnect();

  try {
    await Post.collection.drop();
    console.log('Drop collection of post successfully');
  } catch (error) {
    console.log(error);
  }

  try {
    const datas = generateData(metas);
    await Post.insertMany(datas);
    console.log('Successfully created document of post');
  } catch (error) {
    console.log(error);
  }

  return conn;
}

function generateData(metas: any[]) {
  return metas
    .map((meta: any) => {
      const docs = [];
      for (let i = 0; i < meta.count; i += 1) {
        const doc = {
          title: casual.title,
          author: meta.author,
          body: casual.text
        };
        docs.push(doc);
      }
      return docs;
    })
    .reduce((a, b) => a.concat(b), []);
}

export { main, metaDatas };
