import mongoose from "mongoose";
import { config } from '../../../v6/config';

const houseSchema = new mongoose.Schema({
  name: String,
  images: [{ url: String }],
});

const House = mongoose.model('house', houseSchema);

(async function main() {
  try {
    await mongoose.connect(config.MONGODB_URI);

    const house = new House({
      name: 'house a',
      images: [{ url: 'http://example.com/avatar.jpg' }],
    })
    console.log(house.images instanceof mongoose.Schema.Types.Mixed) // false
    await house.save();

    // query
    const doc = await House.findOne({ name: 'house a' })
    console.log('doc: ', doc)


  } catch (error) {
    console.error(error);
  } finally {
    await mongoose.connection.dropCollection('houses')
    await mongoose.connection.close()
  }
})();