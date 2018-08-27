import { Model, model, Document, Schema } from 'mongoose';

const personSchema = new Schema(
  {
    name: String
  },
  {
    collection: 'left-outer-join_persons'
  }
);

const Person = model('Person', personSchema);

const orderSchema = new Schema(
  {
    orderNo: Number,
    personId: { type: Schema.Types.ObjectId, ref: 'Person' }
  },
  {
    collection: 'left-outer-join_orders'
  }
);

const Order = model('Order', orderSchema);

export { Person, Order };
