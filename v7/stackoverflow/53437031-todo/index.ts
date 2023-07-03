import mongoose from 'mongoose';
import { config } from '../../config';

mongoose.set('debug', true);

const schema = new mongoose.Schema({
	name: String,
});
const User = mongoose.model('user', schema);

(async function main() {
	try {
		await mongoose.connect(config.MONGODB_URI);

		// test
		const query = new mongoose.Query();
		const r2 = await query
			.setOptions({ lean: true })
			// @ts-ignore
			.collection(User.collection)
			.where({ name: 'Tom Benzamin' })
			.select({ _id: 0, address: 0 })
			.exec();
		console.log('r2: ', r2);
	} catch (error) {
		console.error(error);
	} finally {
		await mongoose.connection.close();
	}
})();
