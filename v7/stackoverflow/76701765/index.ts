import mongoose from 'mongoose';
import util from 'util';
import { config } from '../../config';

mongoose.set('debug', true);
console.log(mongoose.version);

const productSchema = new mongoose.Schema({
	title: String,
	images: [],
});
const Product = mongoose.model('Product', productSchema);

const itemSchema = new mongoose.Schema(
	{
		productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
	},
	{ timestamps: true },
);
const Item = mongoose.model('Item', itemSchema);

const ordersSchema = new mongoose.Schema({
	products: [itemSchema],
});
const Orders = mongoose.model('Orders', ordersSchema);

(async function main() {
	try {
		await mongoose.connect(config.MONGODB_URI);
		await Promise.all([Product, Item, Orders].map((m) => m.collection.drop()));
		// seed
		const [p1, p2, p3] = await Product.create([
			{ title: 'product a', images: ['a', 'b'] },
			{ title: 'product b', images: ['c', 'd'] },
			{ title: 'product c', images: ['e', 'f'] },
		]);
		const items = await Item.create([
			{ productId: p1, createdAt: new Date(2023, 6, 4) },
			{ productId: p3, createdAt: new Date(2023, 6, 3) },
			{ productId: p2, createdAt: new Date(2023, 6, 5) },
		]);
		const [o1] = await Orders.create([{ products: items }]);

		// test
		const r = await Orders.aggregate()
			.match({ _id: o1?._id })
			.unwind('products')
			.lookup({
				from: 'products',
				localField: 'products.productId',
				foreignField: '_id',
				as: 'lookup_products',
			})
			.unwind('lookup_products')
			.addFields({ 'products.title': '$lookup_products.title', 'products.images': '$lookup_products.images' })
			.sort({ 'products.createdAt': -1 })
			.group({ _id: '$_id', products: { $push: '$products' } })
			.project({ lookup_products: 0 });

		console.log(util.inspect(r, false, null));
	} catch (error) {
		console.error(error);
	} finally {
		await mongoose.connection.close();
	}
})();
