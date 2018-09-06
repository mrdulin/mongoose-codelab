import { expect } from 'chai';
import { Mongoose, Types } from 'mongoose';
import * as _ from 'lodash';

import { main, orgId, bookId, bookTemplateId2, bookTemplateId } from './seed';
import { MongoConnect } from '../../db';
import { logger } from '../../util';
import { bookResultOverviewByOrgId, getBookTemplateWithBookByOrgId } from './';

let conn: Mongoose | undefined;
before(async () => {
  conn = await MongoConnect();
  await main();
});

after(async () => {
  if (conn) {
    await conn.disconnect();
  }
});

describe('join test suites', () => {
  describe('multiple-collections test suites', () => {
    it('bookResultOverviewByOrgId', async () => {
      const actualValue: any = await bookResultOverviewByOrgId(orgId);
      // logger.info(actualValue);
      expect(actualValue[0].bookResults.bookId).to.be.deep.equal(bookId);
      expect(actualValue[0].orgId).to.be.eql(orgId);
    });

    it('getBookTemplateWithBookByOrgId', async () => {
      const results: any = await getBookTemplateWithBookByOrgId(orgId);
      const actualValue = _.uniqBy(results, (result: any) => result._id.toString());
      logger.info(actualValue);
      expect(actualValue).to.be.have.lengthOf(2);
      [bookTemplateId, bookTemplateId2].forEach((id: Types.ObjectId, idx: number) => {
        expect(actualValue[idx]._id).to.be.deep.equal(id);
      });
    });
  });
});
