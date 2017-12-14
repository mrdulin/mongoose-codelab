import { expect } from 'chai';
import { User } from './models';
import sinon from 'sinon';
import { batchUpdateUsers } from './';
import { BulkWriteOpResultObject } from 'mongodb';

describe('batchUpdateUsers', () => {
  it('should can bulkWrite method with correct parameter', async () => {
    const ids = ['1', '2', '3'];
    const datas = [{ name: 'sinon' }, { name: 'mocha' }, { name: 'chai' }];
    const mBulkWriteOperationResult: BulkWriteOpResultObject = {};
    const stub = sinon.stub(User, 'bulkWrite').resolves(mBulkWriteOperationResult);
    const actualValue = await batchUpdateUsers(ids, datas);
    expect(actualValue).to.be.equal(mBulkWriteOperationResult);
    stub.calledWith([
      { updateone: { filter: { _id: '1' }, update: { name: 'sinon' } } },
      { updateone: { filter: { _id: '2' }, update: { name: 'mocha' } } },
      { updateone: { filter: { _id: '3' }, update: { name: 'chai' } } },
    ]);
    stub.restore();
  });
});
