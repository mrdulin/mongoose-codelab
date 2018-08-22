import * as casual from 'casual';
import * as _ from 'lodash';

function generateUser() {
  return {
    name: casual.username,
    joined: casual.date('YYYY-MM-DD'),
    likes: [casual.word, casual.word, 'music']
  };
}

const metaDatas = {
  count: 8
};

function main(metas: any = metaDatas) {
  const users = [];
  let i = 0;
  while (i < metas.count) {
    const user = generateUser();
    users.push(user);
    i++;
  }
  return users;
}

export { main, metaDatas };
