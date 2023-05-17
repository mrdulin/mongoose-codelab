import mongoose from "mongoose";
import { config } from '../../src/config';

mongoose.set('debug', true);

const userSchema = new mongoose.Schema({
  name: String,
});

const User = mongoose.model('user', userSchema);

(async function main() {
  try {
    await mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });
    await User.create({ name: 'teresa teng' })

    const db = mongoose.connection.useDb('projectDB')

    const projectDB = { User: db.model('user', userSchema) }
    await projectDB.User.create({ name: 'Lin Du' })

  } catch (error) {
    console.error(error);
  } finally {
    await mongoose.connection.close()
  }
})();