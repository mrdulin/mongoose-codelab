import { Schema, model } from 'mongoose';

const LogSchema = new Schema({
  content: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Log = model('Log', LogSchema);

export default Log;
