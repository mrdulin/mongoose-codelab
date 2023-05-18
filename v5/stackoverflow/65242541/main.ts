import mongoose from 'mongoose';
import util from 'util';
import { config } from '../../config';

const UserSchema = new mongoose.Schema({
  name: String
})
const User = mongoose.model('user', UserSchema);

const PostSchema = new mongoose.Schema({
  title: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }
})
const Post = mongoose.model('post', PostSchema);

mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });
mongoose.set('debug', true);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', async () => {
  try {
    // seed
    const users = await User.create([{ name: 'user a' }, { name: 'user b' }]);
    await Post.create([{ title: 'post a', user: users[0]._id }, { title: 'post b', user: users[0]._id }, { title: 'post c', user: users[1]._id }])

    const userIDToBeQuery = users[0]._id;
    const result = await User.aggregate()
      .match({ _id: userIDToBeQuery })
      .lookup({ from: 'posts', localField: '_id', foreignField: 'user', as: 'posts' })

    console.log(util.inspect(result, false, null, true));

  } catch (error) {
    console.log(error);
  } finally {
    await Promise.all([
      db.dropCollection('users'),
      db.dropCollection('posts')
    ]);
    db.close();
  }
})


