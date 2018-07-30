import * as mongoose from 'mongoose';

import { config } from './config';

const { MONGO_HOST, MONGO_PORT, MONGO_APPLICATION_DATABASE } = config;

const uri: string = `mongodb://${MONGO_HOST}:${MONGO_PORT}/${MONGO_APPLICATION_DATABASE}`;

async function MongoConnect(): Promise<mongoose.Mongoose | undefined> {
  let conn;
  try {
    conn = mongoose.connect(
      uri,
      { useNewUrlParser: true }
    );
    console.log('Connect mongodb successfully');
  } catch (error) {
    console.log('Connect mongodb failed');
  }

  return conn;
}

export { MongoConnect };
