import * as casual from 'casual';
import * as _ from 'lodash';

import { IPost, IComment } from '.';

const authorNames = _.fill(Array(2), casual.name);

const metaDatas = {
  comment: {
    author: _.sample(authorNames),
    count: 3
  },
  count: 10,
  commentCount: 10
};

function main(meta: any = metaDatas): Array<IPost<IComment>> {
  const posts: Array<IPost<IComment>> = [];
  let i = 0;
  while (i < meta.count) {
    i++;
    const post: IPost<IComment> = {
      author: casual.name,
      content: casual.description,
      comments: [],
      createdAt: new Date()
    };
    let j = 0;
    while (j < meta.commentCount) {
      const comment: IComment = { date: new Date(), content: casual.sentence, author: '' };
      if (j < 3) {
        comment.author = meta.comment.author;
      } else {
        comment.author = casual.name;
      }
      post.comments.push(comment);
      j++;
    }

    posts.push(post);
  }

  return posts;
}

export { main, metaDatas };
