import mongoose from 'mongoose';
import util from 'util';
import { config } from '../../config';

mongoose.set('debug', true);
console.log(mongoose.version);

interface EventInterface {
	userId: string;
	shifts: any[];
}
const shiftSchema = new mongoose.Schema();
const Shift = mongoose.model('Shift', shiftSchema);

const eventSchema = new mongoose.Schema<EventInterface>({
	userId: String,
	shifts: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Shift',
		},
	],
});

eventSchema.post<EventInterface>('deleteOne', { document: true, query: false }, async function (doc, next) {
	const event = this;
	const Shift = mongoose.model('Shift');
	console.log('doc:', doc, doc instanceof Event);
	console.log('this:', this, this === doc);
	try {
		await Shift.deleteMany({ _id: { $in: event.shifts } });
	} catch (error) {
		next(error);
	}
});
const Event = mongoose.model('Event', eventSchema);

(async function main() {
	try {
		await mongoose.connect(config.MONGODB_URI);
		// seed
		const [s1, s2] = await Shift.create([{}, {}]);
		const [e] = await Event.create([{ userId: '1', shifts: [s1, s2] }]);

		await e?.deleteOne();
	} catch (error) {
		console.error(error);
	} finally {
		await mongoose.connection.close();
	}
})();
