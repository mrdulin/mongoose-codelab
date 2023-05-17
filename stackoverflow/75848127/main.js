import mongoose from "mongoose";
import { config } from '../../src/config';

const productSchema = new mongoose.Schema({
  name: String,
  stocks: Number,
})
const Product = mongoose.model('product', productSchema);

const orderSchema = new mongoose.Schema({
  productId: { type: mongoose.Types.ObjectId, ref: 'product' },
  productName: String,
  quantity: Number
});
const Order = mongoose.model('order', orderSchema);

(async function main() {
  try {
    await mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });
    const createdProducts = await Product.create([{ name: 'item1', stocks: 10 }, { name: 'item2', stocks: 10 }, { name: 'item3', stocks: 10 }])
    const createdOrders = await Order.create([
      { productId: createdProducts[0]._id, productName: createdProducts[0].name, quantity: 1 },
      { productId: createdProducts[1]._id, productName: createdProducts[1].name, quantity: 2 },
      { productId: createdProducts[2]._id, productName: createdProducts[2].name, quantity: 3 }
    ])

    console.log('createdProducts: ', createdProducts)
    console.log('createdOrders: ', createdOrders)

    const ops = createdOrders.map((order) => {
      return {
        updateOne: {
          filter: {
            _id: order.productId,
          },
          update: { $inc: { stocks: -order.quantity } },
        },
      };
    });
    await Product.bulkWrite(ops);

    const updatedProducts = await Product.find();
    console.log('updatedProducts: ', updatedProducts)

  } catch (error) {
    console.error(error);
  } finally {
    await Promise.all(['products', 'orders'].map(co => mongoose.connection.dropCollection(co)))
    await mongoose.connection.close()
  }
})();