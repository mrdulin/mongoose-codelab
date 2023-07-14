import mongoose from 'mongoose';
import util from 'util';
import { config } from '../../config';

mongoose.set('debug', true);
console.log(mongoose.version);

const UserSchema = new mongoose.Schema({ name: String });
const User = mongoose.model('User', UserSchema);

const CourseSchema = new mongoose.Schema(
	{
		title: String,
		userId: {
			type: mongoose.Types.ObjectId,
			ref: 'User',
		},
	},
	{ strict: false },
);
const Course = mongoose.model('Course', CourseSchema);

(async function main() {
	try {
		await mongoose.connect(config.MONGODB_URI);
		// seed
		const [u1] = await User.create([{ name: 'user-a' }]);
		const [c] = await Course.create([{ title: 'course a', userId: u1 }]);

		const r = await Course.aggregate()
			.match({ _id: c?._id })
			.lookup({
				from: 'users',
				localField: 'userId',
				foreignField: '_id',
				as: 'user',
			});

		console.log(util.inspect(r, false, null));
	} catch (error) {
		console.error(error);
	} finally {
		await mongoose.connection.close();
	}
})();
