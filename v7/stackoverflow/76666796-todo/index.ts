import { faker } from '@faker-js/faker';
import mongoose from 'mongoose';
import { config } from '../../config';

mongoose.set('debug', true);
console.log(mongoose.version);

const taskSchema = new mongoose.Schema({ title: String }, { timestamps: true, versionKey: false });
const Task = mongoose.model('Task', taskSchema);

(async function main() {
	try {
		await mongoose.connect(config.MONGODB_URI);
		Task.watch().on('change', (change) => console.log(change));
		// seed
		setImmediate(() => {
			const task = new Task({ title: faker.word.words() });
			task.save();
		});
	} catch (error) {
		console.error(error);
	} finally {
		// await mongoose.connection.close();
	}
})();
