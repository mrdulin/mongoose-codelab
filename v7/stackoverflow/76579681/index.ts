import mongoose from 'mongoose';
import { config } from '../../config';

mongoose.set('debug', true);

const child = new mongoose.Schema({ name: String, studentid: Number });
const schema = new mongoose.Schema({ name: String, age: Number, children: [child] });

const Test = mongoose.model('Test', schema);

(async function main() {
	try {
		await mongoose.connect(config.MONGODB_URI);
		await Test.collection.drop();
		// seed
		const [, t2] = await Test.create([
			{ name: 'name1', age: 14, children: [{ name: 'children1', studentid: 13 }] },
			{
				name: 'name2',
				age: 34,
				children: [
					{ name: 'childr344en1', studentid: 137 },
					{ name: 'children2', studentid: 14 },
				],
			},
		]);
		console.log(t2.toObject());
		const res = await Test.updateMany(
			{
				name: 'name2',
				age: 34,
			},
			{
				$set: {
					'children.$[element]': {
						name: 'updatedname',
						studentid: 123456789,
					},
				},
			},
			{
				arrayFilters: [
					// {
					// 	'element.name': 'childr344en1',
					// 	'element.studentid': 137,
					// },
					{ element: (t2 as any).children[0] },
				],
				upsert: true,
			},
		);
		console.log(res);
		const r = await Test.findOne({ name: 'name2', age: 34 }).select({ __v: 0 });
		console.log(r?.toObject());
	} catch (error) {
		console.error(error);
	} finally {
		await mongoose.connection.close();
	}
})();
