import mongoose from 'mongoose';
import util from 'util';
import { config } from '../../config';

mongoose.set('debug', true);

const userSchema = new mongoose.Schema({
	name: String,
});
const User = mongoose.model('user', userSchema);

(async function main() {
	try {
		await mongoose.connect(config.MONGODB_URI);
		// await Promise.all([Record].map((m) => m.collection.drop()));
		// seed
		// const users = await User.find({}).limit(2).sort({ _id: 'desc' }).exec();
		const filter = {};
		const r = await User.aggregate().match({}).limit(2).sort({ _id: 'desc' }).explain();

		console.log(util.inspect(r, false, null));
	} catch (error) {
		console.error(error);
	} finally {
		await mongoose.connection.close();
	}
})();
