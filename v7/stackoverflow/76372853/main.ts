import mongoose from "mongoose";
import { config } from '../../config';

mongoose.set('debug', true);

const modelSchema = new mongoose.Schema({
  expireAt: { type: Date, expires: 0 }
});
// modelSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 })

const Model = mongoose.model('model', modelSchema);

(async function main() {
  try {
    await mongoose.connect(config.MONGODB_URI);

    // seed
    const baseTime = new Date().getTime();
    await Model.create([{ expireAt: baseTime + 2 * 1_000 }])

  } catch (error) {
    console.error(error);
  } finally {
    await mongoose.connection.close()
  }
})();