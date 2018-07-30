import * as casual from 'casual';
import * as mongoose from 'mongoose';

import { Post } from './';
import { MongoConnect } from '../../../db';

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

function generateData(metas: any[] = metaDatas) {
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

export { generateData, metaDatas };
