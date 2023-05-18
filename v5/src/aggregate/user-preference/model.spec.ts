import { User } from './model';
import { expect } from 'chai';
import sinon from 'sinon';

describe('user-preference unit test suites', () => {
  beforeEach(() => {
    sinon.restore();
  });
  it('#uppercaseAndSortByUsername', async () => {
    // @ts-ignore
    const stub = sinon.stub(User, 'aggregate').resolves({});
    const actualValue = await User.uppercaseAndSortByUsername.call(User);
    expect(actualValue).to.be.eql({});
    expect(
      stub.calledWith([
        {
          $project: {
            name: { $toUpper: '$name' },
            _id: 0,
          },
        },
        { $sort: { name: 1 } },
      ]),
    ).to.be.true;
  });

  it('#usernamesOrderedByJoinMonth', async () => {
    // @ts-ignore
    const stub = sinon.stub(User, 'aggregate').resolves({});
    const actualValue = await User.usernamesOrderedByJoinMonth.call(User);
    expect(actualValue).to.be.eql({});
    expect(
      stub.calledWith([
        {
          $project: { month_joined: { $month: '$joined' }, _id: 0, name: 1 },
        },
        {
          $sort: { month_joined: 1 },
        },
      ]),
    ).to.be.true;
  });

  it('#totalNumberOfJoinsPerMonth', async () => {
    // @ts-ignore
    const stub = sinon.stub(User, 'aggregate').resolves({});
    const actualValue = await User.totalNumberOfJoinsPerMonth.call(User);
    expect(actualValue).to.be.eql({});
    expect(
      stub.calledWith([
        {
          $project: { month_joined: { $month: '$joined' } },
        },
        {
          $group: { _id: { month_joined: '$month_joined' }, number: { $sum: 1 } },
        },
        {
          $sort: { number: 1, '_id.month_joined': 1 },
        },
      ]),
    ).to.be.true;
  });

  it('#topFiveLikes', async () => {
    // @ts-ignore
    const stub = sinon.stub(User, 'aggregate').resolves({});
    const actualValue = await User.topFiveLikes.call(User);
    expect(actualValue).to.be.eql({});
    expect(
      stub.calledWith([
        { $unwind: '$likes' },
        { $group: { _id: '$likes', number: { $sum: 1 } } },
        { $sort: { number: -1, _id: 1 } },
        { $limit: 5 },
      ]),
    ).to.be.true;
  });
});
