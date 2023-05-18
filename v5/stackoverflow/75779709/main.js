import mongoose from "mongoose";
import { config } from '../../config';
import util from 'util';

const schema = new mongoose.Schema({
  name: String,
  topics: [{ name: String, responses: [{ name: String }] }]
});

const Model = mongoose.model('model', schema);

(async function main() {
  try {
    await mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });
    const docs = await Model.create([
      { name: 'name a', topics: [{ name: 'topic a', responses: [{ name: 'response a' }] }, { name: 'topic b', responses: [] }] },
      { name: 'name b', topics: [{ name: 'topic b', responses: [{ name: 'response x' }] }] }
    ]);

    const targetDocId = docs[0]._id;
    const targetTopicId = docs[0].topics[0]._id;

    const updatedDoc = await Model.findOneAndUpdate(
      {
        _id: targetDocId,
        'topics._id': targetTopicId
      },
      {
        $push: { 'topics.$.responses': { name: 'response b' } }
      },
      { new: true }
    )

    console.log('updatedDoc: ', util.inspect(updatedDoc, false, null))

  } catch (error) {
    console.error(error);
  } finally {
    // await mongoose.connection.dropCollection('models');
    await mongoose.connection.close()
  }
})();