import { expect } from 'chai';
import * as mongoose from 'mongoose';

import { Book, IBook } from '.';
import * as MongoInit from './init';
import { init } from '../../../db';

let conn: mongoose.Mongoose | undefined;
let datas: any[];
before(async () => {
  datas = MongoInit.generateData();
  conn = await init(datas, Book, 'book');
});

after(async () => {
  if (conn) {
    await conn.disconnect();
  }
});

describe('Model - Book test suites', () => {
  // it('post find middleware - 1', async () => {
  //   const docs = await Book.find();
  //   expect(docs).to.be.an('array');
  //   expect(docs).to.have.lengthOf(datas.length);
  //   expect(docs.filter((doc: any) => doc.bookNew)).to.have.lengthOf(MongoInit.metaDatas[1].count);
  //   expect(docs.filter((doc: any) => !doc.bookNew)).to.have.lengthOf(MongoInit.metaDatas[0].count);
  // });

  it('post find middleware - 2', async () => {
    const docs = await Book.find();
    expect(docs).to.be.an('array');
    expect(docs).to.have.lengthOf(datas.length);
    expect(docs.filter((doc: IBook) => doc.bookNew)).to.have.lengthOf(MongoInit.metaDatas[2].count);
  });
});
