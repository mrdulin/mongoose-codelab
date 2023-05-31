import mongoose from "mongoose";
import util from 'util';
import { config } from '../../config';

mongoose.set('debug', true);

const modelSchema = new mongoose.Schema({
  ss_characteristics: Array
});
const Model = mongoose.model('model', modelSchema);

(async function main() {
  try {
    await mongoose.connect(config.MONGODB_URI);

    // seed
    await Model.create([
      {
        ss_characteristics: [
          { sinusitis: 'No', id: new mongoose.Types.ObjectId() },
          { sinusitis: 'No', id: new mongoose.Types.ObjectId() }
        ]
      },
      {
        ss_characteristics: [
          { ssfollow_sinusitis: 'No', id: new mongoose.Types.ObjectId() },
          { ssfollow_sinusitis: 'No', id: new mongoose.Types.ObjectId() }
        ]
      },
      {
        ss_characteristics: [
          { ssfollow_sinusitis: 'Yes', id: new mongoose.Types.ObjectId() },
          { ssfollow_sinusitis: 'Yes', id: new mongoose.Types.ObjectId() }
        ]
      }
    ])

    // test
    const updateResult = await Model.updateMany({
      'ss_characteristics': { $elemMatch: { ssfollow_sinusitis: { $exists: true } } }
    }, [
      {
        $set: {
          ss_characteristics: {
            $map: {
              input: '$ss_characteristics',
              in: {
                $mergeObjects: [
                  '$$this',
                  { sinusitis: '$$this.ssfollow_sinusitis' }
                ],
              }
            }
          }
        },
      },
      {
        $unset: "ss_characteristics.ssfollow_sinusitis"
      }
    ])
    console.log('updateResult: ', util.inspect(updateResult, false, null))

    const updateDocs = await Model.find()

    console.log('updateDocs: ', util.inspect(updateDocs, false, null))

  } catch (error) {
    console.error(error);
  } finally {
    await Promise.all(['models'].map(c => mongoose.connection.dropCollection(c)))
    await mongoose.connection.close()
  }
})();



