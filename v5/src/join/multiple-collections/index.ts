import { Types } from 'mongoose';

import { BookTemplate, collectionNamePrefix } from './models';

export async function bookResultOverviewByOrgId(orgId: Types.ObjectId): Promise<any[]> {
  return BookTemplate.aggregate([
    { $match: { orgId } },
    {
      $lookup: {
        from: `${collectionNamePrefix}_books`,
        localField: '_id',
        foreignField: 'bookTemplateId',
        as: 'books',
      },
    },
    { $unwind: '$books' },
    {
      $lookup: {
        from: `${collectionNamePrefix}_bookResults`,
        localField: 'books._id',
        foreignField: 'bookId',
        as: 'bookResults',
      },
    },
    { $unwind: '$bookResults' },
    { $project: { books: 0 } },
  ]);
}

export async function getBookTemplateWithBookByOrgId(orgId: Types.ObjectId) {
  return BookTemplate.aggregate([
    { $match: { orgId } },
    {
      $lookup: {
        from: `${collectionNamePrefix}_books`,
        localField: '_id',
        foreignField: 'bookTemplateId',
        as: 'books',
      },
    },
    { $unwind: '$books' },
  ]);
}
