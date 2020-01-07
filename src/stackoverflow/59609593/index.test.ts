import SomeClass from './';
import sinon from 'sinon';

describe('59609593', () => {
  let instance;
  const mongodbStub = {
    collection: sinon.stub().returnsThis(),
    find: sinon.stub().returnsThis(),
    toArray: sinon.stub(),
  };
  beforeEach(() => {
    instance = new SomeClass(mongodbStub);
  });
  afterEach(() => {
    sinon.restore();
  });
  it('should find authors correctly', async () => {
    const callback = sinon.stub();
    mongodbStub.toArray.resolves([{ id: 1 }, { id: 2 }]);
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
