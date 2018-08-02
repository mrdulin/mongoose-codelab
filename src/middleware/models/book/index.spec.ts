import { expect } from 'chai';
import * as mongoose from 'mongoose';

import { Book } from './';
import * as MongoInit from './init';
import { init } from '../../../db';

let conn: mongoose.Mongoose | undefined;
before(async () => {
  const datas = MongoInit.generateData();
  conn = await init(datas, Book, 'book');
});

after(async () => {
  if (conn) {
    await conn.disconnect();
  }
});

describe('Model - Book test suites', () => {
  it('t-1', async () => {
    const docs = await Book.find();
    console.log('docs: ', docs);
    expect(1).to.be.equal(1);
  });
});
