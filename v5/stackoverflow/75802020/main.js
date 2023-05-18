import mongoose from "mongoose";
import { config } from '../../config';
const { Schema } = mongoose;

mongoose.set('debug', true);

const chatSchema = new Schema({
  users: {
    type: Map,
    of: new Schema({
      createdAt: { type: Date, default: Date.now, immutable: true },
      role: { type: String, default: 'guest', required: true },
    }),
    required: true,
    default: new Map(),
  }
});

const Chat = mongoose.model('chat', chatSchema);

(async function main() {
  try {
    await mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });

    const chat = new Chat();
    chat.users.set(new mongoose.Types.ObjectId(), { role: 'admin' })
    await chat.save();

  } catch (error) {
    console.error(error);
  } finally {
    await mongoose.connection.close()
  }
})();