const { MongoClient } = require('mongodb');
const credentials = { URI: 'mongdb://127.0.0.1:27019' };
const mongoClient = new MongoClient(credentials.URI, { useUnifiedTopology: true });
mongoClient.connect();
const mongodb = mongoClient.db();

const errorHandler = {
  wrap(error, message) {
    console.log(message);
    return error;
  },
};

class SomeClass {
  async getAllAuthors(cb) {
    try {
      const result = await mongodb
        .collection('authors')
        .find({})
        .toArray();
      return cb(null, result);
    } catch (error) {
      return cb(errorHandler.wrap(error, 'while fetching all authors in the book'));
    }
  }
}

module.exports = SomeClass;
