import mongoose from 'mongoose';
import { config } from './config';
import { logger } from './util';
import _ from 'lodash';

const { MONGODB_URI } = config;
const uri = MONGODB_URI;

interface IConnectOptions {
  cleanUp: boolean;
  autoClose: boolean;
}

function MongoConnect(callback: (connection: mongoose.Connection) => Promise<void>, options?: IConnectOptions): void {
  if (!uri) {
    throw new Error('connection uri is empty');
  }
  const defaultOptions = {
    cleanUp: true,
    autoClose: true,
  };
  const finalOptions = _.merge(options, defaultOptions);

  mongoose.set('debug', true);
  mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  mongoose.connection
    .on('connecting', () => {
      logger.info('trying to establish a connection to mongo');
    })
    .on('disconnected', () => {
      logger.info('disconnect mongodb');
    })
    .on('connected', async () => {
      logger.info('Connect mongodb successfully');
      if (finalOptions.cleanUp) {
        try {
          await dropAllCollections(mongoose.connection);
        } catch (error) {
          logger.error('Drop all collections: ', error);
        }
      }
      await callback(mongoose.connection);
      if (finalOptions.autoClose) {
        mongoose.connection.close((err) => err && logger.error(err));
      }
    })
    .on('error', (error) => {
      logger.error(`Connect mongodb failed, ${error}`);
    });
}

async function dropAllCollections(connection: mongoose.Connection) {
  const collections = await connection.db.collections();
  for (const collection of collections) {
    await collection.dropIndexes();
    await collection.drop();
    logger.info(`Dropped all collections`);
  }
}

function init(datas: any[], Model: mongoose.Model<any>, modelName: string, initMongo: boolean = true) {
  MongoConnect(async () => {
    try {
      // await dropAllCollections();
    } catch (error) {
      logger.error(error);
    }

    try {
      await Model.insertMany(datas);
      logger.info(`Successfully created document of ${modelName}`);
    } catch (error) {
      logger.error(error);
    }
  });
}

export { MongoConnect, init };
