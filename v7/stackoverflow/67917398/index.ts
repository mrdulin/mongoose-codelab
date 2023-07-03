// @ts-nocheck
import assert from 'assert';
import mongoose from 'mongoose';
import { config } from '../../config';

mongoose.set('debug', true);

const schema1 = new mongoose.Schema({
	field1: [
		{
			type: {
				type: String,
				default: undefined,
			},
		},
	],
});
const Model1 = mongoose.model('test1', schema1);

const fieldSchema = new mongoose.Schema({
	type: {
		type: String,
		default: undefined,
	},
});
const schema2 = new mongoose.Schema({
	field1: [fieldSchema],
});
const Model2 = mongoose.model('test2', schema2);

const schema3 = new mongoose.Schema({
	field1: { type: [String], default: undefined },
});
const Model3 = mongoose.model('test3', schema3);

(async function main() {
	try {
		await mongoose.connect(config.MONGODB_URI);

		// test
		assert.equal(schema1.childSchemas.length, 1);
		assert.ok(schema1.childSchemas[0]?.schema.$implicitlyCreated);
		assert.equal(schema2.childSchemas.length, 1);
		assert.ok(!schema2.childSchemas[0]?.schema.$implicitlyCreated);

		await Promise.all([Model1, Model2, Model3].map((m) => m.create({})));

		const [r1, r2, r3] = await Promise.all([Model1, Model2, Model3].map((m) => m.findOne()));
		console.log('r1: ', r1?.toObject());
		console.log('r2: ', r2?.toObject());
		console.log('r3: ', r3?.toObject());
	} catch (error) {
		console.error(error);
	} finally {
		await mongoose.connection.close();
	}
})();
