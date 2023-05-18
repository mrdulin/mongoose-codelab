import request from 'supertest';
import { server } from './server';
import { expect } from 'chai';
import sinon from 'sinon';
import categories from './model';

after((done) => {
  server.close(done);
});

describe('Thing API', () => {
  it('returns some things', (done) => {
    const limitStub = sinon.stub().returnsThis();
    const skipStub = sinon.stub().returns([{ foo: 'bar' }]);
    sinon.stub(categories, 'find').callsFake((): any => {
      return {
        limit: limitStub,
        skip: skipStub,
      };
    });

    request(server)
      .get('/api/things')
      .expect((res) => {
        expect(res.body).to.be.an('array');
        expect((categories.find as sinon.SinonStub).calledWith({ name: 'book' })).to.be.true;
        expect(limitStub.calledWith(10)).to.be.true;
        expect(skipStub.calledWith(0)).to.be.true;
      })
      .expect(200, done);
  });
});
