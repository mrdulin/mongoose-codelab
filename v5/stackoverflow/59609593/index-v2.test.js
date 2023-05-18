const sinon = require('sinon');
const mongodb = require('mongodb');

describe('59609593', () => {
  const mongodbStub = {
    connect: sinon.stub().returnsThis(),
    db: sinon.stub().returnsThis(),
    collection: sinon.stub().returnsThis(),
    find: sinon.stub().returnsThis(),
    toArray: sinon.stub(),
  };
  let instance;
  before(() => {
    sinon.stub(mongodb, 'MongoClient').callsFake(() => mongodbStub);
    const SomeClass = require('./index-v2');
    instance = new SomeClass();
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should  find authors', async () => {
    mongodbStub.toArray.resolves([{ id: 1 }, { id: 2 }]);
    const callback = sinon.stub();
    await instance.getAllAuthors(callback);
    sinon.assert.calledWithExactly(mongodbStub.collection, 'authors');
    sinon.assert.calledWithExactly(mongodbStub.find, {});
    sinon.assert.calledOnce(mongodbStub.toArray);
    sinon.assert.calledWithExactly(callback, null, [{ id: 1 }, { id: 2 }]);
  });

  it('should handle error', async () => {
    const callback = sinon.stub();
    const error = new Error('network error');
    mongodbStub.toArray.rejects(error);
    await instance.getAllAuthors(callback);
    sinon.assert.calledWithExactly(callback, error);
  });
});
