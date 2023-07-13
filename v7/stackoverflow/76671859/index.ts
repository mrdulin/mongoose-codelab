import mongoose from 'mongoose';
import { faker } from '@faker-js/faker';
import { config } from '../../config';

mongoose.set('debug', true);
console.log(mongoose.version);

const deviceSchema = new mongoose.Schema({
	dateTimeStamp: {
		type: Date,
		required: true,
	},
});

const Device = mongoose.model('Device', deviceSchema);

(async function main() {
	try {
		await mongoose.connect(config.MONGODB_URI);
		// seed
		await Device.create([
			{ dateTimeStamp: faker.date.between({ from: '2023-06-06 17:00:00', to: '2023-06-06 18:00:00' }) },
			{ dateTimeStamp: faker.date.between({ from: '2023-06-06 17:00:00', to: '2023-06-06 18:00:00' }) },
			{ dateTimeStamp: faker.date.between({ from: '2023-06-07 17:00:00', to: '2023-06-07 18:00:00' }) },
		]);

		// test
		const data = await Device.find({
			dateTimeStamp: {
				$gte: '2023-06-06 17:00:00',
				$lte: '2023-06-06 18:00:00',
			},
		});
		console.log(data);
	} catch (error) {
		console.error(error);
	} finally {
		await mongoose.connection.close();
	}
})();
