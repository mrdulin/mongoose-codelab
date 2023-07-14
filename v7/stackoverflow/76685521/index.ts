import mongoose from 'mongoose';
import { config } from '../../config';

mongoose.set('debug', true);
console.log(mongoose.version);

(async function main() {
	try {
		console.log('before connection', mongoose.connection.db);
		mongoose.connect(config.MONGODB_URI);
		console.log('after connection', mongoose.connection.db);
	} catch (error) {
		console.error(error);
	} finally {
		await mongoose.connection.close();
	}
})();
