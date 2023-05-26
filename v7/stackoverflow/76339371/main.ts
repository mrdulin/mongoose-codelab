import mongoose from "mongoose";
import util from 'util';
import { config } from '../../config';

mongoose.set('debug', true);
const postSchema = new mongoose.Schema({
  title: String,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'userModel'
  }
});
const PostModel = mongoose.model('postsModel', postSchema, 'posts');

const userSchema = new mongoose.Schema({
  email: String,
  posts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'postsModel',
  }]
});
const UserModel = mongoose.model('userModel', userSchema, 'users');


(async function main() {
  try {
    await mongoose.connect(config.MONGODB_URI);

    // seed
    // const posts = await PostModel.create([{ title: 'post a' }, { title: 'post b' }, { title: 'post c' }]);
    // const users = await UserModel.create([{ email: 'user.a@gmail.com', posts: [posts[0]._id, posts[1]._id] }, { email: 'user.b@gmail.com', posts: [posts[2]._id] }])

    const post1 = new PostModel({ title: 'post a' })
    const post2 = new PostModel({ title: 'post b' })
    const post3 = new PostModel({ title: 'post c' })
    const user1 = new UserModel({ email: 'user.a@gmail.com', posts: [post1._id, post2._id] })
    const user2 = new UserModel({ email: 'user.b@gmail.com', posts: [post3._id] })
    post1.author = user1._id;
    post2.author = user1._id;
    post3.author = user2._id;

    await Promise.all([post1, post2, post3, user1, user2].map(e => e.save()))


    // populate author
    const postDocs = await PostModel.find().populate('author', 'email')
    console.log('postDocs: ', util.inspect(postDocs, false, null))

    // populate posts
    const authorDocs = await UserModel.find().populate('posts', 'title')
    console.log('authorDocs: ', util.inspect(authorDocs, false, null))

  } catch (error) {
    console.error(error);
  } finally {
    await Promise.all(['posts', 'users'].map(c => mongoose.connection.dropCollection(c)))
    await mongoose.connection.close()
  }
})();



