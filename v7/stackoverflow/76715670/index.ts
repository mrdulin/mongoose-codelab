import mongoose from 'mongoose';
import util from 'util';
import { config } from '../../config';

mongoose.set('debug', true);
console.log(mongoose.version);

const recordSchema = new mongoose.Schema({
	bills: [{ title: String }],
});
const Record = mongoose.model('Record', recordSchema);

(async function main() {
	try {
		await mongoose.connect(config.MONGODB_URI);
		// await Promise.all([Record].map((m) => m.collection.drop()));
		// seed
		const [r1] = await Record.create([
			{ bills: [{ title: 'Month1' }, { title: 'Month2' }] },
			{ bills: [{ title: 'a' }, { title: 'b' }] },
		]);
		// test
		const r = await Record.aggregate()
			.match({ _id: r1?._id })
			.unwind('$bills')
			.replaceRoot('$bills');

		console.log(util.inspect(r, false, null));
	} catch (error) {
		console.error(error);
	} finally {
		await mongoose.connection.close();
	}
})();
