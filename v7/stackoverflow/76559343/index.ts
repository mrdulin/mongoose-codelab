import mongoose from 'mongoose';
import { config } from '../../config';

mongoose.set('debug', true);

const fooSchema = new mongoose.Schema(
	{
		name: String,
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	},
);
fooSchema.virtual('sampleVirtual').get(function () {
	return 'I am a virtual';
});
const Foo = mongoose.model('foo', fooSchema);

const helloWorldSchema = new mongoose.Schema(
	{
		name: String,
		myFoo: { type: mongoose.Schema.Types.ObjectId, ref: 'foo' },
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	},
);
const HelloWorld = mongoose.model('helloWorld', helloWorldSchema);

(async function main() {
	try {
		await mongoose.connect(config.MONGODB_URI);
		// seed
		const [foo1] = await Foo.create([{ name: 'a' }, { name: 'b' }]);
		const [h1] = await HelloWorld.create([
			{ name: 'x', myFoo: foo1._id },
			{ name: 'y', myFoo: foo1._id },
		]);
		const retVal = await HelloWorld.findOne({ _id: h1._id })
			.populate({ path: 'myFoo', select: '_id name sampleVirtual' })
			.exec();
		console.log(retVal);
	} catch (error) {
		console.error(error);
	} finally {
		await mongoose.connection.close();
	}
})();
