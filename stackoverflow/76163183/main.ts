import { UserModel } from './models/user';
import mongoose from 'mongoose';
import { config } from '../../src/config';

async function main() {
  mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  const db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', async () => {
    // seed
    const user = new UserModel({ username: 'teresa teng', email: 'teresa.teng@example.com', password: '123456', notes: [{ title: 'a', text: 'a-text' }, { title: 'b', text: 'b-text' }] });
    await user.save();

    // query a user and remote a note
    const userDoc1 = await UserModel.findOne({ username: 'teresa teng' });
    console.log('userDoc1: ', userDoc1);
    userDoc1.notes.pull('6453682c4fd3563f4b9ccb0b');
    await userDoc1.save();

    // query the user and check notes
    const userDoc2 = await UserModel.findOne({ username: 'teresa teng' });
    console.log('userDoc2: ', userDoc2);
    db.close();
  })
}

main();