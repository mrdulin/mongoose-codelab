import mongoose, { Document, Query, Schema } from 'mongoose';

interface IUser extends Document {
	firstName: string;
}

const UserSchema = new Schema<IUser>({
	firstName: String,
});

UserSchema.pre(/^find/, async function (next) {
	if (this instanceof Query) {
		const user = this;
		user.find({ active: { $ne: false } });
	}
	next();
});

UserSchema.pre(['find', 'findOne', 'findOneAndDelete', 'findOneAndUpdate'], async function (next) {
	const user = this;
	user.find({ active: { $ne: false } });
	next();
});
