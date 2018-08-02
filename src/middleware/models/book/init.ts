import * as casual from 'casual';
import * as mongoose from 'mongoose';

import { Book } from './';
import { MongoConnect } from '../../../db';

const metaData = {
  count: 10
};

function generateData(metas: any = metaData) {
  const docs = [];
  for (let i = 0; i < metas.count; i += 1) {
    const doc = {
      title: casual.title,
      author: casual.username
    };
    docs.push(doc);
  }
  return docs;
}

export { generateData };
