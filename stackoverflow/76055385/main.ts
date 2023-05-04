import { User } from './user.model';
import mongoose from 'mongoose';
import { config } from '../../src/config';

async function main() {
  mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  const db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', async () => {
    const user = new User({ name: 'teresa teng', email: 'teresa.teng@example.com', password: '123456' });
    await user.save();
    const userDoc = await User.findOne({ name: 'teresa teng' });
    console.log("🚀 ~ file: main.ts:7 ~ main ~ userDoc:", userDoc)
    db.close();
  })
}

main();