// @ts-nocheck
import mongoose from 'mongoose';
import { config } from '../../config';

mongoose.set('debug', true);
console.log(mongoose.version);

const PostSchema = new mongoose.Schema(
	{
		category: { type: String, required: true },
		title: { type: String, required: true },
		isDeleted: { type: Boolean, default: false },
	},
	{ timestamps: true },
);
const Post = mongoose.model('post', PostSchema);

const UserSchema = new mongoose.Schema(
	{
		username: { type: String, required: true },
		posts: { type: [PostSchema] },
		isDeleted: { type: Boolean, default: false },
	},
	{ timestamps: true },
);
const User = mongoose.model('user', UserSchema);

(async function main() {
	try {
		await mongoose.connect(config.MONGODB_URI);
		// seed
		const [u1] = await User.create([
			{
				username: 'user a',
				posts: [
					{ title: 'post a', category: 'a', isDeleted: false },
					{ title: 'post b', category: 'b', isDeleted: false },
				],
				isDeleted: false,
			},
		]);

		console.log(u1?.posts[0].updatedAt);

		// test
		await User.bulkWrite([
			{
				updateMany: {
					filter: {
						isDeleted: false,
					},
					update: {
						'posts.$[post].isDeleted': true,
					},
					arrayFilters: [
						{
							'post.category': { $eq: 'a' },
						},
					],
					upsert: false,
					timestamps: false,
				},
			},
		]);
		const u2 = await User.findOne({ _id: u1._id });
		console.log(u2?.posts[0].updatedAt);
	} catch (error) {
		console.error(error);
	} finally {
		await mongoose.connection.close();
	}
})();
