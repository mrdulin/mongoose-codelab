import mongoose, { Schema } from 'mongoose';
import { config } from '../../config';

const projectSchema = new Schema({
  mode: {
    type: Number,
    min: 0,
    max: 3,
    validate: {
      validator: v => [0, 1, 2, 3].includes(v),
      message: props => `${props.value} must be between 0 and 3`
    },
    default: 1,
    required: [true, "Mode field is required"],
  }
});

const ProjectModel = mongoose.model('project', projectSchema);

async function main() {
  mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  const db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', async () => {
    try {
      // required validation failed
      // const project = new ProjectModel({ mode: null });

      // required validation failed
      // const project = new ProjectModel({ mode: '' })

      // custom validation failed
      const project = new ProjectModel({ mode: 4 });

      // use default value, insert successfully
      // const project = new ProjectModel()
      await project.save();
    } catch (error) {
      console.error(error)
    } finally {
      db.close();
    }
  })
}

main();