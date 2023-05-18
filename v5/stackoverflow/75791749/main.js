import mongoose from "mongoose";
import { config } from '../../config';

mongoose.set('debug', true);

const teams = {
  identifier: {
    type: {
      id: String,
      team: String
    }
  }
};
const teamsSchema = new mongoose.Schema(teams, {
  timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
});

const Team = mongoose.model('teams', teamsSchema);

(async function main() {
  try {
    await mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });

    const team = new Team({ identifier: { id: '1', team: 'test' } })
    await team.save();

    const doc1 = await Team.findOne({ identifier: { id: '1', team: 'test' } });
    console.log('identifier is Mixed type? ', teamsSchema.path('identifier') instanceof mongoose.Schema.Types.Mixed)
    console.log('doc1: ', doc1);

    const doc2 = await Team.findOne({
      "identifier.id": '1',
      "identifier.team": 'test',
    });
    console.log('doc2: ', doc2);

  } catch (error) {
    console.error(error);
  } finally {
    await mongoose.connection.dropCollection('teams')
    await mongoose.connection.close()
  }
})();