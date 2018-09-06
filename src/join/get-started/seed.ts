import { Types } from 'mongoose';
import * as casual from 'casual';
import * as _ from 'lodash';

const personIds = _.fill(Array(3), null).map(() => Types.ObjectId());
const metaDatas = {
  persons: [
    { _id: personIds[0], name: casual.name },
    { _id: personIds[1], name: casual.name },
    { _id: personIds[2], name: casual.name }
  ],

  orders: [
    { orderNo: casual.integer(100, 1000), personId: personIds[2] },
    { orderNo: casual.integer(100, 1000), personId: personIds[1] },
    { orderNo: casual.integer(100, 1000), personId: personIds[2] },
    { orderNo: casual.integer(100, 1000), personId: personIds[1] },
    { orderNo: casual.integer(100, 1000), personId: Types.ObjectId() }
  ]
};

export { metaDatas, personIds };
