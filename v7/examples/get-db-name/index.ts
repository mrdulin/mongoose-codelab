import mongoose from 'mongoose';
import { config } from '../../config';

(async function main() {
	try {
		await mongoose.connect(config.MONGODB_URI);
		const { name } = mongoose.connection;
		console.log('DB connected: ', name);
	} catch (error) {
		console.error(error);
	} finally {
		await mongoose.connection.close();
	}
})();
