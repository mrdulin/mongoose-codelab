import { User } from './models';

function batchUpdateUsers(ids: string[], datas: any[]) {
  const ops = ids.map((id, idx) => {
    return {
      updateOne: {
        filter: {
          _id: id,
        },
        update: datas[idx],
      },
    };
  });
  return User.bulkWrite(ops);
}

export { batchUpdateUsers };
