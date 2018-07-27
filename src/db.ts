import * as mongoose from 'mongoose';

import { config } from './config';

const { MONGO_HOST, MONGO_PORT, MONGO_APPLICATION_DATABASE } = config;

const uri: string = `mongodb://${MONGO_HOST}:${MONGO_PORT}/${MONGO_APPLICATION_DATABASE}`;

function MongoConnect() {
  return mongoose
    .connect(uri)
    .then(() => {
      console.log('Connect mongodb successfully');
    })
    .catch(err => {
      console.log('Connect mongodb failed');
    });
}
