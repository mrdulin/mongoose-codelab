import mongoose from "mongoose";
import { faker } from '@faker-js/faker';
import { config } from '../../src/config';
import util from 'util';

mongoose.set('debug', true);

const userSchema = new mongoose.Schema({
  name: String,
  avatar: String
});
const User = mongoose.model('user', userSchema);

const productSchema = new mongoose.Schema({
  name: String,
  ratings: [{ star: Number, postedBy: { type: mongoose.Types.ObjectId, ref: 'user' } }]
})
const Product = mongoose.model('product', productSchema);

(async function main() {
  try {
    // seed
    await mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });
    const fakeUsers = faker.helpers.multiple(() => ({ name: faker.internet.userName(), avatar: faker.image.avatar() }), { count: 5 })
    const userDocs = await User.create(fakeUsers)

    await Product.create([
      { name: 'product a', ratings: [{ star: 4, postedBy: userDocs[0]._id }, { star: 5, postedBy: userDocs[1]._id }] },
      { name: 'product b', ratings: [{ star: 10, postedBy: userDocs[1]._id }] },
    ])

    // populate
    const populatedResult = await Product.find({ name: 'product a' }).populate({ path: 'ratings.postedBy', select: '_id name' }).exec();
    console.log('populate result: ', util.inspect(populatedResult, false, null))

    // aggregate
    const aggregatedResult = await Product.aggregate([
      {
        '$match': {
          'name': 'product a'
        }
      }, {
        '$unwind': {
          'path': '$ratings'
        }
      }, {
        '$lookup': {
          'from': 'users',
          'localField': 'ratings.postedBy',
          'foreignField': '_id',
          'as': 'user'
        }
      }, {
        '$unwind': {
          'path': '$user'
        }
      }, {
        '$project': {
          '_id': 1,
          'name': 1,
          'ratings': {
            '_id': '$ratings._id',
            'star': '$ratings.star',
            'postedBy': {
              '_id': '$user._id',
              'name': '$user.name'
            }
          }
        }
      }, {
        '$group': {
          '_id': '$_id',
          'name': {
            '$first': '$name'
          },
          'ratings': {
            '$push': '$ratings'
          }
        }
      }
    ])
    console.log('aggregate result: ', util.inspect(aggregatedResult, false, null))

  } catch (error) {
    console.error(error);
  } finally {
    await Promise.all([
      mongoose.connection.dropCollection('users'),
      mongoose.connection.dropCollection('products')
    ])
    await mongoose.connection.close()
  }
})();