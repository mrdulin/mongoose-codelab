import mongoose from 'mongoose';
import { config } from '../../config';

mongoose.set('debug', true);
console.log(mongoose.version);

const menuSchema = new mongoose.Schema(
	{
		user_id: String,
		menu: {
			categories: {
				type: [mongoose.Schema.Types.Mixed],
			},
		},
	},
	{
		collection: 'menus',
		// strict: false
	},
);
const Menu = mongoose.model('menu', menuSchema);

(async function main() {
	try {
		await mongoose.connect(config.MONGODB_URI);
		await Menu.collection.drop();
		// seed
		await Menu.create([{ user_id: '1', menu: { categories: [] } }]);
		// test
		const r = await Menu.updateOne({ user_id: '1' }, { $push: { 'menu.categories': { category: 'a', items: [] } } });
		console.log(r);
	} catch (error) {
		console.error(error);
	} finally {
		await mongoose.connection.close();
	}
})();
