import { server } from './server';
import request from 'supertest';
import Post from './models/post';
import sinon from 'sinon';
import { expect } from 'chai';

after((done) => {
  server.close(done);
});

describe('58820254', () => {
  it('/addPost', (done) => {
    expect(1);
    const saveStub = sinon.stub(Post.prototype, 'save').returnsThis();
    request(server)
      .post('/addPost')
      .expect(() => {
        console.log('assert');
        expect(saveStub.calledOnce).to.be.true;
      })
      .expect(200, done);
  });
});
