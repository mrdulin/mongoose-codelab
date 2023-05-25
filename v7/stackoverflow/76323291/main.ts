import mongoose from "mongoose";
import util from 'util';
import { config } from '../../config';

mongoose.set('debug', true);

const { Schema } = mongoose;

const userSchema = new Schema({
  name: String,
  password: String
})
const User = mongoose.model('User', userSchema);

const bookSchema = new Schema({
  title: String,
  reviews: {
    type: Array
  },
});
const Book = mongoose.model('Book', bookSchema);

(async function main() {
  try {
    await mongoose.connect(config.MONGODB_URI);

    const users = await User.create([{ name: 'a', password: '123' }, { name: 'b', password: 'abc' }])
    const books = await Book.create([{ title: 'book a', reviews: [{ user: users[0]._id }] }, { title: 'book b' }]);

    console.log('reviews is mixed type?', books[0].reviews instanceof Schema.Types.Mixed)

    const book = await Book.findById(books[0]._id).populate({
      path: 'reviews.user',
      model: 'User',
      select: 'name password'
    }).exec();

    console.log(util.inspect(book, false, null))

  } catch (error) {
    console.error(error);
  } finally {
    await Promise.all(['users', 'books'].map(c => mongoose.connection.dropCollection(c)))
    await mongoose.connection.close()
  }
})();