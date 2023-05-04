import { setFullWidth } from '.';
import sinon, { SinonStubbedInstance } from 'sinon';
import { expect } from 'chai';

describe('58868361', () => {
  const fakeElement = {
    setAttribute(attr, value) {
      console.log('setAttribute');
    },
    hasAttribute(attr) {
      console.log('hasAttribute');
    },
    foo() {
      console.log('foo');
    },
  };
  afterEach(() => {
    sinon.restore();
  });
  it('should spy all methods of el', () => {
    const logSpy = sinon.spy(console, 'log');
    const stub: SinonStubbedInstance<typeof fakeElement> = sinon.stub(fakeElement);
    setFullWidth(fakeElement);
    expect(stub.setAttribute.calledWithExactly('width', '100%')).to.be.true;
    expect(stub.hasAttribute.calledWithExactly('width')).to.be.true;
    expect(stub.foo.calledOnce).to.be.true;
    expect(logSpy.callCount).to.be.equal(0);
    logSpy.restore();
  });

  it('should restore to original methods of el', () => {
    const logSpy = sinon.spy(console, 'log');
    setFullWidth(fakeElement);
    expect(logSpy.callCount).to.be.equal(3);
  });
});
