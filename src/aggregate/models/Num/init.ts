import * as mongoose from 'mongoose';

import { Num } from '.';
import { MongoConnect } from '../../../db';

const metaData = {
  x: 10,
  y: 20,
  z: 30,
  count: 2,
};

function generateData(meta: any = metaData) {
  const docs: any[] = [];
  for (let i = 0; i < meta.count; i += 1) {
    const doc = {
      x: metaData.x,
      y: metaData.y,
      z: metaData.z,
    };
    docs.push(doc);
  }
  return docs;
}

export { metaData, generateData };
