import mongoose from "mongoose";
import util from 'util';
import { config } from '../../config';

mongoose.set('debug', true);

const CategoriesSchema = new mongoose.Schema({
  sites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Sites" }],
});

const Categories = mongoose.model("Categories", CategoriesSchema, 'organizer-categories');
const SitesSchema = new mongoose.Schema({
  url: String
});
const Sites = mongoose.model("Sites", SitesSchema, "organizer-sites");

(async function main() {
  try {
    await mongoose.connect(config.MONGODB_URI);
    // seed
    const categoryDoc = await Categories.create({})
    const site = await Sites.create({ url: 'http://google.com' })

    const category = await Categories.findOneAndUpdate(
      { _id: categoryDoc._id },
      { $addToSet: { sites: site } },
      { new: true })
      .populate('sites')

    console.log('category: ', util.inspect(category, false, null))

  } catch (error) {
    console.error(error);
  } finally {
    await Promise.all(['organizer-categories', 'organizer-sites'].map(c => mongoose.connection.dropCollection(c)))
    await mongoose.connection.close()
  }
})();
