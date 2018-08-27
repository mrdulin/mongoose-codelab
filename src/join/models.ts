import { Model, model, Document, Schema } from 'mongoose';

const collectionNamePrefix = 'join';

const personSchema = new Schema(
  {
    name: String
  },
  {
    collection: `${collectionNamePrefix}_persons`
  }
);

const orderSchema = new Schema(
  {
    orderNo: Number,
    personId: { type: Schema.Types.ObjectId, ref: 'Person' }
  },
  {
    collection: `${collectionNamePrefix}_orders`
  }
);

const Order = model('Order', orderSchema);
const Person = model('Person', personSchema);

export { Person, Order, collectionNamePrefix };
