import User from './models/user';
import Chat from './models/chat';
import mongoose from 'mongoose';
import { config } from '../../src/config';

async function main() {
  mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  const db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', async () => {
    try {
      // seed
      console.log('seeding')
      const users = await User.create([
        new User({ name: 'a', email: 'a@example.com', password: '123456' }),
        new User({ name: 'b', email: 'b@example.com', password: '123456' })
      ])
      const chat = new Chat({
        users, messages: [{ text: 'message a', sender: users[0] }, { text: 'message b', sender: users[0] }]
      });
      await chat.save();

      const chatDoc = await Chat.findOne().populate({
        path: 'messages',
        populate: {
          path: 'sender'
        }
      }).exec();
      console.log('chatDoc: ', chatDoc)
      console.log('chatDoc.messages[0].sender.name: ', chatDoc.messages[0].sender.name)

    } catch (error) {
      console.log(error);
    } finally {
      await Promise.all([
        db.dropCollection('users'),
        db.dropCollection('chats'),
      ])
      db.close();
    }
  })
}

main();
