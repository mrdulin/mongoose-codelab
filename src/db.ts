import * as mongoose from 'mongoose';

import { config } from './config';
import { logger } from './util';

const { MONGO_HOST, MONGO_PORT, MONGO_APPLICATION_DATABASE, MONGODB_URI } = config;

// const uri: string = `mongodb://${MONGO_HOST}:${MONGO_PORT}/${MONGO_APPLICATION_DATABASE}`;
const uri = MONGODB_URI;

async function MongoConnect(): Promise<mongoose.Mongoose | undefined> {
  mongoose.connection
    .on('connecting', () => {
      logger.info('trying to establish a connection to mongo');
    })
    .on('disconnected', () => {
      logger.info('disconnect mongodb');
    })
    .on('connected', () => {
      logger.info('Connect mongodb successfully');
    })
    .on('error', error => {
      logger.error(`Connect mongodb failed, ${error}`);
    });

  return mongoose.connect(
    uri,
    { useNewUrlParser: true }
  );
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
    const collections = await Model.db.db.listCollections().toArray();
    if (collections.length) {
      await Model.collection.dropIndexes();
      await Model.collection.drop();
      logger.info(`Drop collection of ${modelName} successfully`);
    }
  } catch (error) {
    logger.error(error);
  }

  try {
    await Model.insertMany(datas);
    logger.info(`Successfully created document of ${modelName}`);
  } catch (error) {
    logger.error(error);
  }

  return conn;
}

export { MongoConnect, init };
