import mongoose, { HydratedDocument } from 'mongoose';

interface Something {
  name: string;
}
const somethingSchema = new mongoose.Schema<Something>({
  name: String
}, {
  collection: 'something',
  toJSON: {
    transform(doc: HydratedDocument<Something>) {

    },
  }
})

