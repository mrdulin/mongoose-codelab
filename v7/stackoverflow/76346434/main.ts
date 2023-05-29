import mongoose from "mongoose";
import util from 'util';
import { config } from '../../config';

mongoose.set('debug', true);

const studentSchema = new mongoose.Schema({
  name: String,
  scores: Array
});
const Student = mongoose.model('student', studentSchema);


(async function main() {
  try {
    await mongoose.connect(config.MONGODB_URI);

    // seed
    await Student.create([
      {
        name: "pranay kumar",
        scores: [{ "score": 120, "type": "exam" }, { "score": 8, "type": "quiz" }, { "score": 43, "type": "homework" }]
      },
      {
        name: 'Nick',
        scores: [{ "score": 100, "type": "exam" }, { "score": 3, "type": "quiz" }, { "score": 40, "type": "homework" }]
      }
    ]);

    const result = await Student.aggregate()
      .project({
        name: 1,
        totalScore: {
          "$sum": "$scores.score"
        }
      })
      .sort({ totalScore: -1 })
      .limit(1)

    console.log('result: ', util.inspect(result, false, null))

  } catch (error) {
    console.error(error);
  } finally {
    await Promise.all(['students'].map(c => mongoose.connection.dropCollection(c)))
    await mongoose.connection.close()
  }
})();



