import { model, Schema } from 'mongoose';

const postSchema = new Schema({
  titie: String,
});

export default model('post', postSchema);
