// @ts-nocheck
import mongoose from 'mongoose';
import util from 'util';
import { config } from '../../config';

mongoose.set('debug', true);
console.log(mongoose.version);

const UserSchema = new mongoose.Schema({
	name: String,
	tasks: [
		{
			type: mongoose.Schema.ObjectId,
			ref: 'Task',
		},
	],
});
const User = mongoose.model('User', UserSchema);

const TaskSchema = new mongoose.Schema({
	title: String,
	user: {
		type: mongoose.Schema.ObjectId,
		required: true,
		ref: 'User',
	},
});

const Task = mongoose.model('Task', TaskSchema);

(async function main() {
	try {
		await mongoose.connect(config.MONGODB_URI);
		// seed
		const u = new User({ name: 'Nick' });
		await u.save();

		// create task
		const user = await User.findById(u._id);
		const task = new Task({ title: 'Task 1', user });
		await task.save();
		user.tasks.push(task);
		await user.save();

		// populate
		const users = await User.find().populate('tasks');
		console.log('users:', util.inspect(users, false, null));
		const tasks = await Task.find().populate('user');
		console.log('tasks: ', util.inspect(tasks, false, null));
	} catch (error) {
		console.error(error);
	} finally {
		await mongoose.connection.close();
	}
})();
