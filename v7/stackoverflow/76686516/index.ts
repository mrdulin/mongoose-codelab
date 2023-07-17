import mongoose from 'mongoose';
import { config } from '../../config';

mongoose.set('debug', true);
console.log(mongoose.version);

const Nested = new mongoose.Schema({
	name: String,
});

const nestedSchemaBuilder = (keys, schema) => {
	return keys.reduce((acc, key) => {
		acc[key] = schema;
		return acc;
	}, {});
};

const keys = ['en', 'bg', 'fr'];
const MainSchema = new mongoose.Schema({
	name: String,
	nested: nestedSchemaBuilder(keys, Nested),
});
const Main = mongoose.model('Main', MainSchema);

(async function main() {
	try {
		await mongoose.connect(config.MONGODB_URI);
		// seed
		await Main.create([
			{
				name: 'a',
				nested: keys.reduce((acc, cur) => {
					acc[cur] = { name: cur };
					return acc;
				}, {}),
			},
		]);
		const doc = await Main.findOne();
		console.log(doc?.toObject());
	} catch (error) {
		console.error(error);
	} finally {
		await mongoose.connection.close();
	}
})();
