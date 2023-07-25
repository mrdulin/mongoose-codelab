import mongoose from 'mongoose';
import { config } from '../../config';

mongoose.set('debug', true);
console.log(mongoose.version);

const FoodSchema = new mongoose.Schema({
	// id: String,
	name: String,
});
const Food = mongoose.model('Food', FoodSchema);

(async function main() {
	try {
		await mongoose.connect(config.MONGODB_URI);
		// seed
		const sample_foods = {
			id: '1',
			name: 'Pizza Pepperoni',
		};
		// create ObjectId explicitly
		// await Food.create({ ...sample_foods, id: new mongoose.Types.ObjectId() });

		// create ObjectId implicitly
		// const { id, ...rest } = sample_foods;
		await Food.create(sample_foods);

		// declare a id field with String type
		// await Food.create(sample_foods);
	} catch (error) {
		console.error(error);
	} finally {
		await mongoose.connection.close();
	}
})();
