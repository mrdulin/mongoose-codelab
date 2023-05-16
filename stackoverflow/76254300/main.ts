import Post from './models/post';
import Comment from './models/comment';
import mongoose from 'mongoose';
import { config } from '../../src/config';

mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', async () => {
  try {
    // seed
    // @ts-ignore
    const comments = await Comment.create([{ content: 'comment a' }, { content: 'comment b' }])
    const post = new Post({ title: 'post a', comments });
    await post.save();

    // test
    const postDoc = await Post.findOne({ title: 'post a' })
    await postDoc.remove();

  } catch (error) {
    console.log(error);
  } finally {
    db.close();
  }
})

