import mongoose from "mongoose";
import util from 'util';
import { config } from '../../config';

mongoose.set('debug', true);
interface Product {
  name: string;
  description: string;
  category: string;
}
const productSchema = new mongoose.Schema<Product>({
  name: String,
  description: String,
  category: String
});
const Product = mongoose.model<Product>('product', productSchema);

(async function main() {
  try {
    await mongoose.connect(config.MONGODB_URI);

    // seed
    await Product.create(
      [
        { name: 'apple', description: 'best apple', category: 'a' },
        { name: 'banana', description: 'best banana', category: 'a' },
        { name: 'PS5', description: 'Play Station 5', category: 'b' }
      ]
    )

    const search = 'apple'
    const description = ''
    const category = 'b'

    const query = Product.find();
    search && query.or([{ name: { '$regex': search, '$options': 'i' } }])
    description && query.or([{ description: { '$regex': description, '$options': 'i' } }])
    category && query.or([{ category: { '$regex': category, '$options': 'i' } }])

    console.log('query: ', util.inspect(query.getQuery(), false, null))

    const docs = await query.exec();
    console.log('docs: ', docs);

  } catch (error) {
    console.error(error);
  } finally {
    await Promise.all(['products'].map(c => mongoose.connection.dropCollection(c)))
    await mongoose.connection.close()
  }
})();



