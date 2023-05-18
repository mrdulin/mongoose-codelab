import { FooClass } from '.';
import sinon, { assert } from 'sinon';

describe('48775401', () => {
  it('should spy all methods of FooClass', () => {
    sinon.spy(FooClass.prototype as any);
    const logSpy = sinon.spy(console, 'log');
    const fooClass = new FooClass();
    fooClass.getData();
    assert.calledOnce(fooClass.getData as sinon.SinonSpy);
    assert.calledOnce(fooClass.barMethod as sinon.SinonSpy);
    assert.calledWith(logSpy.firstCall, 'getData');
    assert.calledWith(logSpy.secondCall, 'getDataFromDb');
    assert.calledWith(logSpy.thirdCall, 'barMethod');
  });
});
