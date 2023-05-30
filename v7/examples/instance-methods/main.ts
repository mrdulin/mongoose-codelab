// @ts-nocheck
import mongoose from "mongoose";
import util from 'util';
import { config } from '../../config';

mongoose.set('debug', true);

const userSchema = new mongoose.Schema({
  name: String,
});

userSchema.methods.checkPassword = async function () {
  return true;
};

const User = mongoose.model('user', userSchema);

(async function main() {
  try {
    await mongoose.connect(config.MONGODB_URI);

    // seed
    await User.create([{ name: 'Nick' }, { name: 'Lin' }, { name: 'Tom' }]);

    const user = await User.findOne({ name: 'Nick' })
    console.log('user: ', user)
    const isPass = await user.checkPassword();
    console.log("🚀 ~ file: main.ts:27 ~ main ~ isPass:", isPass)

  } catch (error) {
    console.error(error);
  } finally {
    await Promise.all(['users'].map(c => mongoose.connection.dropCollection(c)))
    await mongoose.connection.close()
  }
})();



