import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let con: mongoose.Connection;
let mongoServer: MongoMemoryServer;

export const connectDB = async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri(), {})
    .catch((err) => {
      console.log(err);
    });
  con = mongoose.connection;
  console.log('con.readyState: ', con.readyState);
}

connectDB();