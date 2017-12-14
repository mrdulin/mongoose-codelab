import { Person, Order, collectionNamePrefix } from './models';

/**
 * left outer join
 * persons是左表, orders是右表
 * 获取所有的人，以及他们的定购 - 如果有的话。
 *
 * @author dulin
 * @returns {Promise<any[]>}
 */
async function getAllPersonWithOrders(): Promise<any[]> {
  return Person.aggregate([
    {
      $lookup: {
        from: `${collectionNamePrefix}_orders`,
        localField: '_id',
        foreignField: 'personId',
        as: 'orders',
      },
    },
    { $project: { 'orders.personId': 0 } },
    {
      $unwind: {
        path: '$orders',
        preserveNullAndEmptyArrays: true,
      },
    },
    { $sort: { name: 1 } },
  ]);
}

/**
 * right outer join
 * 列出所有的定单，以及定购它们的人 - 如果有的话。
 *
 * @author dulin
 * @returns {Promise<any[]>}
 */
async function getAllOrdersWithPerson(): Promise<any[]> {
  return Order.aggregate([
    {
      $lookup: {
        from: `${collectionNamePrefix}_persons`,
        localField: 'personId',
        foreignField: '_id',
        as: 'persons',
      },
    },
    {
      $project: { personId: 0 },
    },
    {
      $unwind: {
        path: '$persons',
        preserveNullAndEmptyArrays: true,
      },
    },
  ]);
}

/**
 * inner join
 * 获取所有人的订购
 *
 * @author dulin
 * @returns {Promise<any[]>}
 */
async function getPersonWithOrders(): Promise<any[]> {
  return Person.aggregate([
    {
      $lookup: {
        from: `${collectionNamePrefix}_orders`,
        localField: '_id',
        foreignField: 'personId',
        as: 'order',
      },
    },
    { $project: { 'order.personId': 0 } },
    { $unwind: '$order' },
    { $sort: { name: 1 } },
  ]);
}

export { getAllPersonWithOrders, getAllOrdersWithPerson, getPersonWithOrders };
