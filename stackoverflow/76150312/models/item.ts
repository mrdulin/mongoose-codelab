import { Schema } from 'mongoose';

export const itemSchema = new Schema({
  name: { type: String, required: [true, `The field name is required.`] },
});
