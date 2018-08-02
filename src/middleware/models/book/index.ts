import { Model, Document, Schema, model } from 'mongoose';

const bookSchema = new Schema({
  title: String,
  author: String,
  created: { type: Date, default: Date.now },

  // https://stackoverflow.com/questions/24130600/strange-mongoose-schema-js-error-options-may-not-be-used-as-a-schema-pathnam/24130689
  // isNew: Boolean
  bookNew: Boolean
});

// https://stackoverflow.com/questions/30611991/mongoose-find-and-findone-middleware-not-working
bookSchema.post('find', function postFindHook(docs: any, next: any) {
  console.log('post-find');

  const updatePromises = docs.map((doc: any) => {
    const createdTampstamp = new Date(doc.created).getTime();
    doc.bookNew = createdTampstamp > 1000;
    return doc.save();
  });

  Promise.all(updatePromises)
    .then(newDocs => {
      // console.log('newDocs: ', newDocs);
      next();
    })
    .catch(next);
});

const Book = model('Book', bookSchema);

export { Book };
