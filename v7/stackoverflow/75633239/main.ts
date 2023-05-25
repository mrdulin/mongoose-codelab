import mongoose from "mongoose";
import util from 'util';
import { config } from '../../config';

mongoose.set('debug', true);

const borrowBookSchema = new mongoose.Schema({
  member_id: {
    type: String,
    required: true,
  },
  bookdetails: [{
    bookid: String,
    status: Boolean
  }]
});
const BorrowBook = mongoose.model('borrow_book', borrowBookSchema);

(async function main() {
  try {
    await mongoose.connect(config.MONGODB_URI);

    // seed
    const books = await BorrowBook.create([
      {
        member_id: new mongoose.Types.ObjectId(), bookdetails: [
          { bookid: new mongoose.Types.ObjectId(), status: false },
          { bookid: new mongoose.Types.ObjectId(), status: false },
          { bookid: new mongoose.Types.ObjectId(), status: true }]
      },
      { member_id: new mongoose.Types.ObjectId(), bookdetails: [] }
    ])

    // test
    // let response = await BorrowBook
    //   .aggregate()
    //   .match({ member_id: books[0].member_id })
    //   .unwind('$bookdetails')
    //   .match({ 'bookdetails.status': { $eq: false } })
    //   .group({
    //     _id: '$_id',
    //     member_id: { '$first': '$member_id' },
    //     bookdetails: {
    //       $push: {
    //         bookid: '$bookdetails.bookid',
    //         status: '$bookdetails.status',
    //         _id: '$bookdetails._id'
    //       }
    //     }
    //   })
    //   .exec();

    // console.log(util.inspect(response, false, null))

    const response1 = await BorrowBook
      .aggregate()
      .match({ member_id: books[0].member_id })
      .project({
        member_id: 1,
        bookdetails: {
          $filter: {
            input: '$bookdetails',
            as: 'item',
            cond: { $eq: ['$$item.status', false] }
          }
        }
      })
      .exec()

    console.log('response1: ', util.inspect(response1, false, null))

  } catch (error) {
    console.error(error);
  } finally {
    await Promise.all(['borrow_books'].map(c => mongoose.connection.dropCollection(c)))
    await mongoose.connection.close()
  }
})();



