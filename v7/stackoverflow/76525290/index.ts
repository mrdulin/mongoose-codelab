import mongoose from 'mongoose';
import util from 'util';
import { config } from '../../config';

mongoose.set('debug', true);

const userSchema = new mongoose.Schema({ taskSets: [] });
const User = mongoose.model('user', userSchema);

(async function main() {
	try {
		await mongoose.connect(config.MONGODB_URI);
		await Promise.all([User].map((m) => m.collection.drop()));
		// seed
		const user = await User.create({
			taskSets: [
				{
					_id: '649376ee6d1efd215999881a',
					name: 'Clearning',
					tasks: [
						{ _id: '649316f16d1efd2139998884', taskName: 'living_room' },
						{ _id: '649316ee6d1efd215829882b', taskName: 'kitchen' },
					],
				},
				{
					_id: '649316ee3d1efd285999882d',
					name: 'Mail',
					tasks: [{ _id: '1234', taskName: 'deliver' }],
				},
			],
		});
		// test
		const r = await User.findOneAndUpdate(
			{ _id: user._id },
			{
				$pull: {
					'taskSets.$[ts].tasks': { _id: '649316f16d1efd2139998884' },
				},
			},
			{ arrayFilters: [{ 'ts._id': '649376ee6d1efd215999881a' }], new: true },
		);
		console.log(util.inspect(r, false, null));
	} catch (error) {
		console.error(error);
	} finally {
		await mongoose.connection.close();
	}
})();
