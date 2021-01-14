import { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  tokens: { token: string }[];
  encryptPassword(password: string): Promise<string>;
  validatePassword(password: String): Promise<boolean>;
}
const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    trim: true,
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});
userSchema.methods.generateAuthToken = async function (this: IUser) {
  const user = this;
  const token = user._id.toString() + 'thisismysecretkey';
  user.tokens = this.tokens.concat({ token });
};
