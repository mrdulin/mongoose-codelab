import mongoose from 'mongoose';
import { config } from '../../config';

mongoose.set('debug', true);

const userSchema = new mongoose.Schema({
	email: String,
	accountType: {
		type: {
			type: String,
		},
	},
});
const User = mongoose.model('user', userSchema);

(async function main() {
	try {
		await mongoose.connect(config.MONGODB_URI);
		await User.collection.drop();
		// seed
		await User.create({ email: 'nick@gmail.com', accountType: { type: 'social_account' } });

		//test
		const r = await User.aggregate()
			.match({ email: 'nick@gmail.com' })
			.project({ type: '$accountType.type', email: 1, _id: 0 })
			.exec();
		console.log('r: ', r);

		const r2 = await User.aggregate([
			{ $match: { email: 'nick@gmail.com' } },
			{
				$replaceRoot: {
					newRoot: {
						$mergeObjects: ['$$ROOT', '$accountType'],
					},
				},
			},
			{
				$project: {
					accountType: 0,
					__v: 0,
					_id: 0,
				},
			},
		]);
		console.log('r2: ', r2);
	} catch (error) {
		console.error(error);
	} finally {
		await mongoose.connection.close();
	}
})();
