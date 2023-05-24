import mongoose from "mongoose";
import util from 'util';
import { config } from '../../config';
const { Schema } = mongoose;

const userSchema = new Schema({
  name: String,
  email: String,
  gender: { type: String, enum: ['male', 'female'], default: 'male' },
  age: { type: Number, default: 21 },
  blogposts: [{ type: Schema.Types.ObjectId, ref: 'BlogPost' }],
  followers: [{ type: Schema.Types.ObjectId, ref: 'User' }]
});

const commentSchema = new Schema({
  asers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  _creator: { type: Schema.Types.ObjectId, ref: 'User' },
  content: String
});
const blogPostSchema = new Schema({
  _creator: { type: Schema.Types.ObjectId, ref: 'User' },
  title: String,
  comments: [commentSchema],
  fans: [{ type: Schema.Types.ObjectId, ref: 'User' }]
});

const BlogPost = mongoose.model('BlogPost', blogPostSchema);
const User = mongoose.model('User', userSchema);

(async function main() {
  try {
    await mongoose.connect(config.MONGODB_URI);

    await User.create({
      name: 'T-100',
      email: 'terminator100@learnboost.com'
    });

    const user2 = await User.create({
      name: 'T-1000',
      email: 'terminator1000@learnboost.com'
    });

    const post = await BlogPost.create({
      title: 'Woot',
      comments: [
        { _creator: null, content: 'Woot woot' },
        { _creator: user2, content: 'Wha wha' }
      ]
    });

    // non-existant subprop
    // await BlogPost.findById(post._id).populate({
    //   path: 'comments._idontexist',
    //   select: 'email',
    //   strictPopulate: false
    // });

    // add a non-schema property to the document.
    await BlogPost.collection.updateOne(
      { _id: post._id }, { $set: { 'comments.0._idontexist': user2._id } }
    );

    const post2 = await BlogPost.findById(post._id).populate({
      path: 'comments._idontexist',
      select: 'email',
      model: 'User',
      strictPopulate: false
    });

    console.log('post2: ', util.inspect(post2, false, null))

  } catch (error) {
    console.error(error);
  } finally {
    await Promise.all(['users', 'blogposts'].map(c => mongoose.connection.dropCollection(c)))
    await mongoose.connection.close()
  }
})();