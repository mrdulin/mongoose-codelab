import mongoose from 'mongoose';

export const FormMetaSchema = new mongoose.Schema({
  username: String,
}, { strict: false });

export const FormMetaModel = mongoose.model('formMeta', FormMetaSchema);
