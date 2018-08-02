import * as casual from 'casual';
import * as mongoose from 'mongoose';

import { Book } from './';
import { MongoConnect } from '../../../db';

const metaDatas = [
  {
    created: casual.date('2018-5-1'),
    bookNew: false,
    count: 4
  },
  {
    created: casual.date('2018-8-1'),
    bookNew: true,
    count: 2
  },
  {
    created: casual.date('2018-8-3'),
    bookNew: true,
    count: 4
  }
];

function generateData(metas: any[] = metaDatas) {
  return metaDatas
    .map(meta => {
      const docs = [];
      for (let i = 0; i < meta.count; i += 1) {
        const doc = {
          title: casual.title,
          author: casual.username,
          created: meta.created,
          bookNew: meta.bookNew
        };
        docs.push(doc);
      }
      return docs;
    })
    .reduce((a, b) => a.concat(b), []);
}

export { generateData, metaDatas };
