import mongoose from 'mongoose';
import { config } from '../../config';

mongoose.set('debug', true);

const Schema = mongoose.Schema;

const dataAssetsSchema = Schema({
  name: String,
  database: {
    type: { type: String },
    url: { type: String },
    db: { type: String },
    username: { type: String },
    password: { type: String },
    collection: String,
    indexing: String,
  },
  schema: [{ type: Schema.Types.Mixed }],
});

const DataAssets = mongoose.model('data_assets', dataAssetsSchema);

const data = {
  schema: [
    {
      name: 'name',
      column: 'name',
      role: 'dimension',
      type: 'string',
    },
  ],
  name: 'china_train_station',
  database: {
    type: 'NOSQL',
    url: 'mongodb://localhost:27017',
    username: '',
    password: '',
    db: 'test',
    collection: 'station',
    indexing: 'name',
  },
};

async function main() {
  try {
    await mongoose.connect(config.MONGODB_URI);
    // await Promise.all(['data_assets'].map((collection) => mongoose.connection.dropCollection(collection)));

    await DataAssets.create(data);
  } catch (error) {
    console.error(error);
  } finally {
    await mongoose.connection.close();
  }
}

main();
