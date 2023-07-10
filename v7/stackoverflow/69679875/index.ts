import mongoose from 'mongoose';
import util from 'util';
import { config } from '../../config';

mongoose.set('debug', true);

const PaymentMethodSchema = new mongoose.Schema({
	name: String,
});
const PaymentMethod = mongoose.model('PaymentMethod', PaymentMethodSchema);

const CompanySchema = new mongoose.Schema({
	companyName: String,
	settings: {
		type: {
			priceVisible: Boolean,
			paymentMethodsAvailable: [{ type: mongoose.Schema.Types.ObjectId, ref: 'PaymentMethod' }],
		},
	},
});
const Company = mongoose.model('Company', CompanySchema);

(async function main() {
	try {
		await mongoose.connect(config.MONGODB_URI);
		await Promise.all([PaymentMethod, Company].map((m) => m.collection.drop()));

		// seed
		const [p1] = await PaymentMethod.create([{ name: 'a' }, { name: 'b' }]);
		const [c1] = await Company.create([
			{
				companyName: 'c-a',
				settings: {
					priceVisible: true,
					paymentMethodsAvailable: [p1],
				},
			},
		]);

		const company = await Company.findOne({ _id: c1?._id }).populate('settings.paymentMethodsAvailable');
		console.log(util.inspect(company?.toObject(), false, null));
	} catch (error) {
		console.error(error);
	} finally {
		await mongoose.connection.close();
	}
})();
