import mongoose, { Types } from 'mongoose';

interface ISchool {
	name: string;
	address: string;
}
interface IPerson {
	name: string;
	school?: Types.ObjectId;
}
const PersonSchema: mongoose.Schema<IPerson> = new mongoose.Schema<IPerson>({
	name: { type: String },
	school: { type: mongoose.Schema.Types.ObjectId, ref: 'School' },
});

const Person = mongoose.model<IPerson>('Person', PersonSchema);

(async function run() {
	const person1 = await Person.findOne({});
	person1?.school; // school is ObjectId

	const person2 = await Person.findOne({}).populate<{ school: ISchool }>({ path: 'school', model: 'School' });
	person2?.school; // scholl is ISchool
})();
