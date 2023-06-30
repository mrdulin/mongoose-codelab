// @ts-nocheck
import mongoose from 'mongoose';
import { config } from '../../config';

mongoose.set('debug', true);

const schema = new mongoose.Schema({
	currentMovie: [{ lang: String, movie: String }],
});
const Account = mongoose.model('account', schema);

(async function main() {
	try {
		await mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
		await Promise.all([Account].map((m) => m.collection.drop()));
		// seed
		const a = new Account({ currentMovie: [{ lang: 'en', movie: 'Zootopia 2016' }] });
		await a.save();

		// test
		const account = await Account.findOne();
		const currentMovie = account.currentMovie.find((m) => m.lang == 'en');
		currentMovie.movie = 'Oblivion 2013';
		await account?.save();
	} catch (error) {
		console.error(error);
	} finally {
		await mongoose.connection.close();
	}
})();
