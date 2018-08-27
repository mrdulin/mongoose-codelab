import { Person, Order } from './models';

/**
 * persons是左表, orders是右表
 * 获取所有的人，以及他们的定购 - 如果有的话。
 */
async function getOrdersOfPerson(): Promise<any[]> {
  return Person.aggregate([
    {
      $lookup: {
        from: 'left-outer-join_orders',
        localField: '_id',
        foreignField: 'personId',
        as: 'orders'
      }
    },
    { $project: { 'orders.personId': 0 } },
    {
      $unwind: {
        path: '$orders',
        preserveNullAndEmptyArrays: true
      }
    },
    { $sort: { name: 1 } }
  ]);
}

export { getOrdersOfPerson };
