// @ts-nocheck
import mongoose from 'mongoose';
import { config } from '../../config';

mongoose.set('debug', true);

const userSchema = new mongoose.Schema({
	userId: { type: String, required: true, unique: true },
	email: String,
});
userSchema.statics.findUser = async function (userId: string) {
	return this.findOne({ userId });
};
mongoose.model('User', userSchema);

(async function main() {
	try {
		await mongoose.connect(config.MONGODB_URI);
		console.log(mongoose.models);
		// const User = mongoose.models['User'];
		const User = mongoose.model('User', userSchema);

		// seed
		await User?.create({ userId: '1', email: 'test@example.com' });
		const userDoc = await User.findUser('1');
		console.log(userDoc);
	} catch (error) {
		console.error(error);
	} finally {
		await mongoose.connection.close();
	}
})();
