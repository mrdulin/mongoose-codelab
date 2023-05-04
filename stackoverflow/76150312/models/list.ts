import mongoose, { Schema } from 'mongoose';
import { itemSchema } from './item';

export const listsSchema = new Schema({
  name: {
    type: String,
    required: [true, `The name of the list is required.`],
  },
  items: [itemSchema],
});

export const List = mongoose.model('list', listsSchema);