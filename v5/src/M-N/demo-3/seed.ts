import * as casual from 'casual';
import * as _ from 'lodash';
import { Types } from 'mongoose';

function main() {
  const categoryCount = 5;
  const categoryIds = _.fill(Array(categoryCount), null).map(() => Types.ObjectId());

  const products = [
    { _id: Types.ObjectId(), name: casual.word, categoryIds: _.sampleSize(categoryIds, 2) },
    { _id: Types.ObjectId(), name: casual.word, categoryIds: _.sampleSize(categoryIds, 4) }
  ];

  const categories = [];

  for (let i = 0; i < categoryCount; i++) {
    categories.push({ _id: categoryIds[i], name: casual.word });
  }

  return { products, categories };
}

export { main };
