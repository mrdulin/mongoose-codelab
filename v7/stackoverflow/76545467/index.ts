import mongoose from 'mongoose';
import { config } from '../../config';

mongoose.set('debug', true);

const userSchema = new mongoose.Schema({
	name: String,
});
userSchema.method('dept', async function () {
	console.log(this);
	// @ts-ignore
	const result = await mongoose.model('bill').aggregate([
		{
			$match: {
				$and: [{ 'user._id': this._id }, { balance: { $gt: 0 } }],
			},
		},
		{
			$group: { _id: null, total: { $sum: '$balance' } },
		},
	]);
	return result[0].total;
});
const User = mongoose.model('user', userSchema);

const billSchema = new mongoose.Schema({
	balance: Number,
	user: userSchema,
});
const Bill = mongoose.model('bill', billSchema);

(async function main() {
	try {
		await mongoose.connect(config.MONGODB_URI);
		await Promise.all([User, Bill].map((m) => m.collection.drop()));
		// seed
		const [user1, user2] = await User.create([{ name: 'Nick' }, { name: 'Jack' }]);
		await Bill.create([
			{ balance: 100, user: user1 },
			{ balance: 200, user: user1 },
			{ balance: 0, user: user1 },
			{ balance: 50, user: user2 },
		]);
		//@ts-ignore
		const dept = await user1.dept();
		console.log("Nick's dept: ", dept);
	} catch (error) {
		console.error(error);
	} finally {
		await mongoose.connection.close();
	}
})();
