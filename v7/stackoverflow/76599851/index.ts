import Grid from 'gridfs-stream';
import mongoose from 'mongoose';
import { config } from '../../config';

(async function main() {
	try {
		console.log('Before DB connected: ', mongoose.connection.db);
		await mongoose.connect(config.MONGODB_URI);
		const { db } = mongoose.connection;
		console.log('DB connected: ', db);
		const mongo = mongoose.mongo;

		const gfs = Grid(db, mongo);
		console.log(gfs);
	} catch (error) {
		console.error(error);
	} finally {
		await mongoose.connection.close();
	}
})();
