import { expect } from 'chai';
import * as mongoose from 'mongoose';

import { Post, IPost } from './';
import * as MongoInit from './init';
import { init } from '../../../db';

let conn: mongoose.Mongoose | undefined;
before(async () => {
  const datas = MongoInit.generateData();
  conn = await init(datas, Post, 'post');
});

after(async () => {
  if (conn) {
    await conn.disconnect();
  }
});

describe('Model - Post test suites', () => {
  it('findTopAuthor', async () => {
    const res = await Post.schema.statics.findTopAuthor();
    expect(res).to.be.an('array');
    expect(res.length).to.be.equal(MongoInit.metaDatas.length);
  });

  it('findOneByAuthorName', async () => {
    const author = MongoInit.metaDatas[0].author;
    const post: IPost = await Post.schema.statics.findOneByAuthorName(author);
    expect(post.author).to.be.equal(author);
  });
});
