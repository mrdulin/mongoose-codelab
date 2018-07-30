import * as casual from 'casual';

import { Post } from './models/Post';
import { MongoConnect } from '../db';

async function main() {
  await MongoConnect();
  const datas = generateData([
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
  ]);

  try {
    await Post.insertMany(datas);
    console.log('Successfully created document of post');
  } catch (error) {
    console.log(error);
  }
  process.exit();
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

main();
