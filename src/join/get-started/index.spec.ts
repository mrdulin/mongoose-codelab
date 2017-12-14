import { expect } from 'chai';
import { Mongoose } from 'mongoose';
import * as _ from 'lodash';

import { Person, Order } from './models';
import { metaDatas } from './seed';
import { init, MongoConnect } from '../../db';
import { logger } from '../../util';
import { getAllPersonWithOrders, getAllOrdersWithPerson, getPersonWithOrders } from '.';

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

describe('join test suites', () => {
  describe('get-started test suites', () => {
    it('getAllPersonWithOrders', async () => {
      const actualValue = await getAllPersonWithOrders();
      // logger.info(actualValue);
      expect(actualValue).to.have.lengthOf(5);
      const personNames = _.chain(actualValue)
        .map((doc: any) => doc.name)
        .uniq()
        .value();

      expect(personNames).to.have.lengthOf(metaDatas.persons.length);
      expect(personNames).to.be.deep.equal(
        _.chain(metaDatas.persons)
          .orderBy(['name'], ['asc'])
          .map((person) => person.name)
          .value(),
      );

      const orderNoArray = _.chain(actualValue)
        .map((doc: any) => doc.orders)
        .filter((v) => v)
        .value();

      // logger.info(orderNoArray);
      expect(orderNoArray).to.have.lengthOf(4);
    });

    it('getAllOrdersWithPerson', async () => {
      const actualValue = await getAllOrdersWithPerson();
      expect(actualValue).to.have.lengthOf(metaDatas.orders.length);

      const personNames = _.chain(actualValue)
        .map((doc: any) => (doc.persons ? doc.persons.name : ''))
        .filter((v) => v)
        .uniq()
        .value();

      // logger.info(personNames);

      expect(personNames).to.have.lengthOf(2);
    });

    it('getPersonWithOrders', async () => {
      const actualValue = await getPersonWithOrders();
      expect(actualValue).to.have.lengthOf(4);

      const personNames = _.chain(actualValue)
        .map((doc: any) => doc.name)
        .uniq()
        .value();
      expect(personNames).to.have.lengthOf(2);
    });
  });
});
