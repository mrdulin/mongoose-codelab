import mongoose from 'mongoose';
import { config } from '../../config';

mongoose.set('debug', true);
console.log(mongoose.version);

const reviewSchema = new mongoose.Schema({});
reviewSchema.post('deleteOne', function () {
	console.log('post deleteOne');
});
reviewSchema.post('updateOne', function () {
	console.log('post updateOne');
});
const Review = mongoose.model('Review', reviewSchema);

(async function main() {
	try {
		await mongoose.connect(config.MONGODB_URI);
		// seed
		const [r1] = await Review.create([{}, {}]);
		// test
		// updateOne
		await r1?.updateOne({ name: 'teresa teng' }); // works
		await Review.updateOne({ _id: r1?._id }, { name: 'teresa teng' }); // works

		// deleteOne
		await Review.deleteOne({ _id: r1?._id }); // works
		await r1?.deleteOne(); // doesn't work
	} catch (error) {
		console.error(error);
	} finally {
		await mongoose.connection.close();
	}
})();
