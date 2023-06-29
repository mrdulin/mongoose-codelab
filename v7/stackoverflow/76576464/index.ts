// @ts-nocheck
import mongoose from 'mongoose';
import util from 'util';
import { config } from '../../config';

const CategorySchema = new mongoose.Schema({
	name: String,
	expenses: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Expense',
		},
	],
});
const Category = mongoose.model('Category', CategorySchema);

const ExpenseSchema = new mongoose.Schema({
	name: String,
	category: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Category',
	},
});
const Expense = mongoose.model('Expense', ExpenseSchema);

(async function main() {
	mongoose.set('debug', true);
	try {
		await mongoose.connect(config.MONGODB_URI);
		await Promise.all([Category, Expense].map((m) => m.collection.drop()));
		// seed
		const [c1, c2] = [{ name: 'c1' }, { name: 'c2' }].map((v) => new Category(v));
		const [e1, e2, e3] = [
			{ name: 'e1', category: c1._id },
			{ name: 'e2', category: c1._id },
			{ name: 'e3', category: c2._id },
		].map((v) => new Expense(v));

		c1.expenses.push(e1, e2);
		c2.expenses.push(e3);

		await Promise.all([c1, c2].map((v) => v.save()));
		await Promise.all([e1, e2, e3].map((v) => v.save()));

		// populate
		const c = await Category.findOne({ name: 'c1' }).populate('expenses').exec();
		console.log(c?.toObject());
		const e = await Expense.findOne({ name: 'e1' })
			.populate({ path: 'category', populate: { path: 'expenses' } })
			.exec();
		console.log(util.inspect(e?.toObject(), false, null));
	} catch (error) {
		console.error(error);
	} finally {
		await mongoose.connection.close();
	}
})();
