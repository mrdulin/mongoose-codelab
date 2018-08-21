import { expect } from 'chai';
import * as mongoose from 'mongoose';
import * as _ from 'lodash';

import * as seed from './seed';
import { init, MongoConnect } from '../db';
import { logger } from '../util';
import { Category } from './model';
// import { getProductWithCategories } from './';

let conn: mongoose.Mongoose | undefined;
let datas: any;
before(async () => {
  datas = seed.main();
  conn = await init(datas, Category, 'Category');
});

after(async () => {
  if (conn) {
    await conn.disconnect();
  }
});

describe('category-hierarchy test suites', () => {
  it('should initialize categories collection correcly', async () => {
    const categories = await Category.find({}).exec();
    expect(categories).to.be.have.lengthOf(5);
  });
});
