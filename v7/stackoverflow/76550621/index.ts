import mongoose from 'mongoose';
import { config } from '../../config';

mongoose.set('debug', true);

const recordSchema = new mongoose.Schema({
	extras: [String],
	skills: [String],
});
recordSchema.pre('validate', function (next) {
	console.log('this: ', this);
	next();
});
const Record = mongoose.model('record', recordSchema);

(async function main() {
	try {
		await mongoose.connect(config.MONGODB_URI);
		await Promise.all([Record].map((m) => m.collection.drop()));
		// seed
		const body = {
			extras: [{ value: 'a' }, { value: 'b' }, { value: 'c' }],
			skills: [{ value: 'x' }, { value: 'y' }],
		};
		const r1 = new Record(body);
		console.log('r1: ', r1);

		const r2 = new Record({ extras: body.extras.map((v) => v.value), skills: body.skills.map((v) => v.value) });
		console.log('r2: ', r2);
		await r2.save();
	} catch (error) {
		console.error(error);
	} finally {
		await mongoose.connection.close();
	}
})();
