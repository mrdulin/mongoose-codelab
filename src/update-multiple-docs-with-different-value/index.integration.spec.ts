import { expect } from 'chai';
import { Mongoose } from 'mongoose';
import { BulkWriteOpResultObject } from 'mongodb';
import * as casual from 'casual';

import { User } from './models';
import { seed } from './seed';
import { init } from '../db';
import { logger } from '../util';
import { batchUpdateUsers } from './';

let conn: Mongoose | undefined;
before(async () => {
  const datas = seed();
  conn = await init(datas, User, 'User');
});

after(async () => {
  if (conn) {
    await conn.disconnect();
  }
});

describe('update-multiple-docs-with-different-value test suites', () => {
  it('t-1', async () => {
    const users = await User.find();
    const userIds = users.map((user) => user._id);
    const datas: any[] = [];
    for (let i = 0; i < userIds.length; i++) {
      const data = { name: casual.username, age: i };
      datas.push(data);
    }
    const actualValue: BulkWriteOpResultObject = await batchUpdateUsers(userIds, datas);
    logger.info({ label: 'actualValue', message: actualValue });
    const { matchedCount, modifiedCount } = actualValue;

    expect(matchedCount).to.be.eql(users.length);
    expect(modifiedCount).to.be.eql(users.length);
    expect(matchedCount).to.be.eql(modifiedCount);
  });
});
