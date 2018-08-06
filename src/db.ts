import * as mongoose from 'mongoose';

import { config } from './config';

const { MONGO_HOST, MONGO_PORT, MONGO_APPLICATION_DATABASE } = config;

const uri: string = `mongodb://${MONGO_HOST}:${MONGO_PORT}/${MONGO_APPLICATION_DATABASE}`;

async function MongoConnect(): Promise<mongoose.Mongoose | undefined> {
  let conn;
  mongoose.set('debug', true);
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

async function init(
  datas: any[],
  Model: mongoose.Model<any>,
  modelName: string,
  initMongo: boolean = true
): Promise<mongoose.Mongoose | undefined> {
  let conn: mongoose.Mongoose | undefined;
  if (initMongo) {
    conn = await MongoConnect();
  }

  try {
    await Model.collection.drop();
    console.log(`Drop collection of ${modelName} successfully`);
  } catch (error) {
    console.log(error);
  }

  try {
    await Model.insertMany(datas);
    console.log(`Successfully created document of ${modelName}`);
  } catch (error) {
    console.log(error);
  }

  return conn;
}

export { MongoConnect, init };
