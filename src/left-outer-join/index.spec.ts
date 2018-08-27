import { expect } from 'chai';
import { Mongoose } from 'mongoose';
import * as _ from 'lodash';

import { Person, Order } from './models';
import { metaDatas } from './seed';
import { init, MongoConnect } from '../db';
import { logger } from '../util';
import { getOrdersOfPerson } from './';

let conn: Mongoose | undefined;
before(async () => {
  conn = await MongoConnect();
  await Promise.all([init(metaDatas.persons, Person, 'Person', false), init(metaDatas.orders, Order, 'Order', false)]);
});

after(async () => {
  if (conn) {
    await conn.disconnect();
  }
});

describe('left-outer-join test suites', () => {
  it('getOrdersOfPerson', async () => {
    const actualValue = await getOrdersOfPerson();
    // logger.info(actualValue);
    expect(actualValue).to.have.lengthOf(5);
    const personNames = _.chain(actualValue)
      .map((doc: any) => doc.name)
      .uniq()
      .value();

    expect(personNames).to.be.deep.equal(
      _.chain(metaDatas.persons)
        .orderBy(['name'], ['asc'])
        .map(person => person.name)
        .value()
    );
  });
});
