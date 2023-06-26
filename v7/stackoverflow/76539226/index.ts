import mongoose from 'mongoose';
import { config } from '../../config';

mongoose.set('debug', true);

const billSchema = new mongoose.Schema({
	author: String,
});
const QuoteModel = mongoose.model('quote', billSchema);

(async function main() {
	try {
		await mongoose.connect(config.MONGODB_URI);
		await Promise.all([QuoteModel].map((m) => m.collection.drop()));
		// seed
		await QuoteModel.create([
			{ author: 'Nick' },
			{ author: 'Nick' },
			{ author: 'Jack' },
			{ author: 'John' },
			{ author: 'Alex' },
		]);

		const searchWord = 'CK';

		const uniqueQuoteAuthors = await QuoteModel.aggregate()
			.group({
				_id: '$author',
				count: { $sum: 1 },
			})
			.match({ _id: { $regex: searchWord, $options: 'i' } });

		console.log('uniqueQuoteAuthors: ', uniqueQuoteAuthors);
	} catch (error) {
		console.error(error);
	} finally {
		await mongoose.connection.close();
	}
})();
