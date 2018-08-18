import { expect } from 'chai';
import * as mongoose from 'mongoose';

import { Sale, ISale } from '.';
import * as MongoInit from './init';
import { init } from '../../../db';

let conn: mongoose.Mongoose | undefined;
before(async () => {
  const datas = MongoInit.generateData();
  conn = await init(datas, Sale, 'sale');
});

after(async () => {
  if (conn) {
    await conn.disconnect();
  }
});

describe('Model - Sale test suites', () => {
  it('getAggregateDataByDate', async () => {
    const results = await Sale.schema.statics.getAggregateDataByDate();
    // console.log('results: ', results);
    expect(results).to.be.an('array');
  });

  it('getTotalData', async () => {
    const results = await Sale.schema.statics.getTotalData();
    console.log('results: ', results);
    expect(results).to.be.an('array');
    expect(results.length).to.be.equal(1);
    expect(results[0]._id).to.be.a('null');
  });
});
