import mongoose from 'mongoose';
import { config } from '../../config';

async function main() {
  const db = mongoose.createConnection(config.MONGODB_URI);
  const collection = db.collection('chats');

  const cursor = await collection.find();
  const docs = await cursor.toArray();
  console.log('docs:', docs)

  await db.close();
}

main();
