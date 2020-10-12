import { createSandbox } from 'sinon';
import Log from './Log';
import LogController from './LogController';
import { expect } from 'chai';

describe('LogController', () => {
  let sandbox;
  let createStub;

  beforeEach(() => {
    sandbox = createSandbox();
    createStub = sandbox.stub(Log, 'create');
  });

  describe('create()', () => {
    it('should create a Log with the given content', async () => {
      await LogController.create('Bob Lob Law is on the house');
      expect(createStub.calledWith({ content: 'Bob Lob Law is on the house' })).to.be.true;
    });
  });
});
