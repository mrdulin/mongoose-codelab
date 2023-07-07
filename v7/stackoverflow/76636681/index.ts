import mongoose from 'mongoose';
import util from 'util';
import { config } from '../../config';

mongoose.set('debug', true);
console.log(mongoose.version);

const QuestionSchema = new mongoose.Schema({
	score: Number,
});
const Question = mongoose.model('Question', QuestionSchema);

const AssignmentModuleSchema = new mongoose.Schema({
	title: { type: String },
	questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
});
const AssignmentModule = mongoose.model('AssignmentModule', AssignmentModuleSchema);

const AssignmentSchema = new mongoose.Schema({
	modules: [
		{
			module: { type: mongoose.Schema.Types.ObjectId, ref: 'AssignmentModule' },
			dueDate: { type: Date },
		},
	],
});
const Assignment = mongoose.model('Assignment', AssignmentSchema);

(async function main() {
	try {
		await mongoose.connect(config.MONGODB_URI);
		await Promise.all([Question, Assignment, AssignmentModule].map((m) => m.collection.drop()));
		// seed
		const [q1] = await Question.create([{ score: 100 }, { score: 80 }]);
		const [m1] = await AssignmentModule.create([{ title: 'a', questions: [q1] }, { title: 'b' }]);
		await Assignment.create([{ modules: [{ module: m1, dueDate: Date.now() }] }, { modules: [] }]);

		// test
		const assignmentDocs = await Assignment.find().populate({
			path: 'modules.module',
			select: '-__v',
			populate: { path: 'questions', select: '-__v' },
		});
		console.log(util.inspect(assignmentDocs, false, null));
	} catch (error) {
		console.error(error);
	} finally {
		await mongoose.connection.close();
	}
})();
