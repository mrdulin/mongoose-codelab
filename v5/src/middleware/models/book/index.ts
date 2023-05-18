import { Model, Document, Schema, model, NativeError } from 'mongoose';
import * as casual from 'casual';

export interface IBook extends Document {
  _id: string;
  title: string;
  author: string;
  created: string;
  bookNew: boolean;
}

const bookSchema = new Schema({
  _id: Schema.Types.ObjectId,
  title: String,
  author: String,
  created: { type: Date, default: Date.now },

  // https://stackoverflow.com/questions/24130600/strange-mongoose-schema-js-error-options-may-not-be-used-as-a-schema-pathnam/24130689
  // isNew: Boolean
  bookNew: Boolean
});

// 方式一:
// https://stackoverflow.com/questions/30611991/mongoose-find-and-findone-middleware-not-working
// bookSchema.post('find', function postFindHook(docs: any, next: any) {
//   console.log('post-find');

//   const updatePromises = docs.map((doc: any) => {
//     const createdTampstamp = new Date(doc.created).getTime();
//     doc.bookNew = createdTampstamp > new Date(casual.date('2018-6-1')).getTime();

//     // https://stackoverflow.com/questions/31419366/how-to-update-document-on-pre-or-post-query-hook-in-mongoose
//     return doc.save();
//   });

//   Promise.all(updatePromises)
//     .then(newDocs => {
//       // console.log('newDocs: ', newDocs);
//       next();
//     })
//     .catch(next);
// });

// 方式二：
// bookSchema.post<IBook>('find', function postFindHook(docs: any, next: (err?: NativeError) => void) {
//   console.log('post-find');

//   // console.log('original docs: ', docs);

//   const docsToBeUpdated: IBook[] = docs
//     .filter((doc: IBook): boolean => doc.bookNew)
//     .map(
//       (doc: IBook): IBook => {
//         const createdTampstamp: number = new Date(doc.created).getTime();
//         doc.bookNew = createdTampstamp > new Date(casual.date('2018-8-2')).getTime();
//         return doc;
//       }
//     )
//     .filter((doc: IBook): boolean => !doc.bookNew);

//   // console.log('docsToBeUpdated: ', docsToBeUpdated);

//   if (!docsToBeUpdated.length) {
//     next();
//   }

//   Book.updateMany({ _id: { $in: docsToBeUpdated.map((doc: any) => doc._id) } }, { $set: { bookNew: false } })
//     .then(() => next())
//     .catch(next);
// });

const Book: Model<IBook> = model<IBook>('Book', bookSchema);

export { Book };
