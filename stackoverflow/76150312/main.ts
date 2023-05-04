import { List } from './models/list';
import mongoose from 'mongoose';
import { config } from '../../src/config';

async function main() {
  mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  const db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', async () => {
    // seed
    const list = new List({ name: 'list-a', items: [{ name: 'item-a' }, { name: 'item-b' }] });
    await list.save();

    // query
    const listDoc = await List.findOne({ name: 'list-a' });
    listDoc.items.push({ name: 'item-c' });
    await listDoc.save();

    console.log('list-a: ', await List.findOne({ name: 'list-a' }));

    await db.dropCollection('lists');
    db.close();
  })
}

main();