import { expect } from 'chai';
import * as mongoose from 'mongoose';

import { Post, IPost } from '.';
import * as seed from './init';
import { init } from '../../../../db';
import { logger } from '../../../../util';

let conn: mongoose.Mongoose | undefined;
let datas: any[];
before(async () => {
  datas = seed.main();
  conn = await init(datas, Post, 'Post');
});

after(async () => {
  if (conn) {
    await conn.disconnect();
  }
});

describe('nested data model test suites', () => {
  it('find comments by author name', async () => {
    const posts = await Post.find({ 'comments.author': seed.metaDatas.comment.author }, { comments: 1 }).exec();
    expect(posts).to.be.have.lengthOf(datas.length);
    posts.forEach(post => {
      expect(post.comments).to.be.have.lengthOf(seed.metaDatas.commentCount);
    });
  });

  it('find comments by author name filter by application code', async () => {
    const posts = await Post.find({ 'comments.author': seed.metaDatas.comment.author }, { comments: 1 }).exec();
    expect(posts).to.be.have.lengthOf(datas.length);
    posts
      .map(post => {
        post.comments = post.comments.filter(comment => comment.author === seed.metaDatas.comment.author);
        return post;
      })
      .forEach(post => {
        expect(post.comments).to.be.have.lengthOf(seed.metaDatas.comment.count);
      });
  });
});
