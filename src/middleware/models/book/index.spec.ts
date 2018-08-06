import { expect } from 'chai';
import * as mongoose from 'mongoose';
import { BulkWriteOpResultObject } from 'mongodb';
import { countBy } from 'lodash';

import { Book, IBook } from './';
import * as MongoInit from './init';
import { init, MongoConnect } from '../../../db';

let conn: mongoose.Mongoose | undefined;
let datas: any[];
before(async () => {
  conn = await MongoConnect();
});

after(async () => {
  if (conn) {
    await conn.disconnect();
  }
});

describe('Model - Book test suites', () => {
  beforeEach(async () => {
    datas = MongoInit.generateData();
    await init(datas, Book, 'book', false);
  });
  // it('post find middleware - 1', async () => {
  //   const docs = await Book.find();
  //   expect(docs).to.be.an('array');
  //   expect(docs).to.have.lengthOf(datas.length);
  //   expect(docs.filter((doc: any) => doc.bookNew)).to.have.lengthOf(MongoInit.metaDatas[1].count);
  //   expect(docs.filter((doc: any) => !doc.bookNew)).to.have.lengthOf(MongoInit.metaDatas[0].count);
  // });

  // it('post find middleware - 2', async () => {
  //   const docs = await Book.find();
  //   expect(docs).to.be.an('array');
  //   expect(docs).to.have.lengthOf(datas.length);
  //   expect(docs.filter((doc: IBook) => doc.bookNew)).to.have.lengthOf(MongoInit.metaDatas[2].count);
  // });

  // http://mongoosejs.com/docs/promises.html#queries-are-not-promises
  it('should not return promise when invoke Book.find()', () => {
    expect(Book.find()).to.not.be.a('promise');
  });

  // http://mongoosejs.com/docs/promises.html#built-in-promises
  it('should return promise when invoke Book.find().exec()', () => {
    expect(Book.find().exec()).to.be.a('promise');
  });

  // it('shoule be ok when invoke Book.update()', () => {});

  it('should be ok when use promise.all with mongoose queries and async/await', async () => {
    const ops = [];
    const book: IBook | null = await Book.findOne();
    if (book) {
      expect(book._id.toString()).to.be.a('string');
      const count = 100;
      for (let i = 0; i < count; i += 1) {
        const op = Book.update({ _id: book._id }, { $set: { bookNew: true } }).exec();
        ops.push(op);
      }

      const results = await Promise.all(ops);
      expect(results).to.be.an('array');
      expect(results).to.have.lengthOf(count);
    }
  });

  it('should be ok when use promise.all with mongoose queries', () => {
    return Book.findOne().then(book => {
      if (book) {
        const ops = [];
        expect(book._id.toString()).to.be.a('string');
        const count = 100;
        for (let i = 0; i < count; i += 1) {
          const op = Book.update({ _id: book._id }, { $set: { bookNew: true } }).exec();
          ops.push(op);
        }

        return Promise.all(ops).then(results => {
          expect(results).to.be.an('array');
          expect(results).to.have.lengthOf(count);
        });
      }
    });
  });

  it('should be ok when use promise.all with mongoose queries', () => {
    return Book.findOne().then(book => {
      if (book) {
        const ops = [];
        expect(book._id.toString()).to.be.a('string');
        const count = 100;
        for (let i = 0; i < count; i += 1) {
          const op = Book.update({ _id: book._id }, { $set: { bookNew: true } });
          ops.push(op);
        }

        return Promise.all(ops).then(results => {
          expect(results).to.be.an('array');
          expect(results).to.have.lengthOf(count);
        });
      }
    });
  });

  it('should update book correctly using Book.bulkWrite()', async () => {
    const docs = await Book.find();
    const ops = docs.map(doc => {
      const update = { $set: { bookNew: !doc.bookNew } };
      return {
        updateOne: {
          filter: { _id: doc._id },
          update
        }
      };
    });

    const bulkWriteOpResultObject: BulkWriteOpResultObject = await Book.bulkWrite(ops);
    const books = await Book.find();
    const aggregate = countBy(books, book => book.bookNew);
    expect(bulkWriteOpResultObject).to.be.an('object');
    console.log('aggregate: ', aggregate);
    expect(aggregate.true).to.equal(MongoInit.metaDatas[0].count);
    expect(aggregate.false).to.equal(MongoInit.metaDatas[1].count + MongoInit.metaDatas[2].count);
  });
});
