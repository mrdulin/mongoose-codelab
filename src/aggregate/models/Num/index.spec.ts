import { expect } from 'chai';
import * as mongoose from 'mongoose';

import { Num, INum } from './';
import * as MongoInit from './init';
import { init } from '../../../db';

let conn: mongoose.Mongoose | undefined;
before(async () => {
  const datas = MongoInit.generateData();
  conn = await init(datas, Num, 'num');
});

after(async () => {
  if (conn) {
    await conn.disconnect();
  }
});

describe('Model - Num test suites', () => {
  const {
    metaData: { x, y, z }
  } = MongoInit;

  it('add', async () => {
    const results = await Num.schema.statics.add();
    const expectValue: number = x + y + z;
    expect(results).to.be.an('array');
    expect(results.length).to.be.equal(MongoInit.metaData.count);
    expect(results[0].result).to.be.equal(expectValue);
  });

  it('subtract', async () => {
    const results = await Num.schema.statics.subtract();
    const expectValue: number = x - y - z;
    expect(results).to.be.an('array');
    expect(results[0].result).to.be.equal(expectValue);
  });
});
