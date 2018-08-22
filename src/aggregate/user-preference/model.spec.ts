import { expect } from 'chai';
import { Mongoose } from 'mongoose';
import * as _ from 'lodash';

import {
  User,
  MODEL_NAME,
  IUsernamesOrderedByJoinMonth,
  IUserDocument,
  ITotalNumberOfJoinsPerMonthResponse,
  ITopFiveLikes
} from './model';
import * as seed from './seed';
import { init } from '../../db';
import { logger } from '../../util';

let conn: Mongoose | undefined;
let datas: any[];
before(async () => {
  datas = seed.main();
  conn = await init(datas, User, MODEL_NAME);
});

after(async () => {
  if (conn) {
    await conn.disconnect();
  }
});

describe('user-preference test suites', () => {
  it('uppercaseAndSortUsername', async () => {
    const docs: Array<{ name: string }> = await User.uppercaseAndSortByUsername();
    expect(docs).to.have.lengthOf(seed.metaDatas.count);
    // logger.info(docs);
    const datasTransfered = _.chain(datas)
      .map((data: IUserDocument): string => data.name.toUpperCase())
      .sortBy()
      .toJSON();

    // logger.info(datasTransfered);

    docs.forEach((doc: { name: string }, idx: number) => {
      expect(doc.name).to.be.equal(datasTransfered[idx]);
    });
  });

  it('usernamesOrderedByJoinMonth', async () => {
    const actualValue: IUsernamesOrderedByJoinMonth[] = await User.usernamesOrderedByJoinMonth();
    // logger.info(actualValue);
    const expectValue = _.chain(datas)
      .map(
        (data: IUserDocument): IUsernamesOrderedByJoinMonth => {
          const monthJoined: number = new Date(data.joined).getMonth() + 1;
          return {
            name: data.name,
            month_joined: monthJoined
          };
        }
      )
      .orderBy(['month_joined'], ['asc'])
      .value();

    // logger.info(expectValue);
    expect(actualValue).to.be.deep.equal(expectValue);
  });

  it('totalNumberOfJoinsPerMonthResponse', async () => {
    const actualValue: ITotalNumberOfJoinsPerMonthResponse[] = await User.totalNumberOfJoinsPerMonth();
    // logger.info({ label: 'actualValue', msg: actualValue });
    const expectValue = _.chain(datas)
      .map((data: IUserDocument) => {
        const monthJoined: number = new Date(data.joined).getMonth() + 1;
        return {
          month_joined: monthJoined
        };
      })
      .groupBy('month_joined')
      .map((objs, key) => {
        return {
          _id: {
            month_joined: Number.parseInt(key, 10)
          },
          number: objs.length
        };
      })
      .orderBy(['number', '_id.month_joined'], ['asc', 'asc'])
      .value();

    // logger.info({ label: 'expectValue', msg: expectValue });

    expect(actualValue).to.be.deep.equal(expectValue);
  });

  it('topFiveLikes', async () => {
    const actualValue: ITopFiveLikes[] = await User.topFiveLikes();
    // logger.info({ label: 'actualValue', msg: actualValue });

    const expectValue = _.chain(datas)
      .reduce((pre: string[], data: IUserDocument) => pre.concat(data.likes), [])
      .countBy()
      .map((val, key) => {
        return {
          _id: key,
          number: val
        };
      })
      .orderBy(['number', '_id'], ['desc', 'asc'])
      .take(5)
      .value();

    // logger.info(expectValue);
    expect(actualValue).to.be.deep.equal(expectValue);
  });
});
