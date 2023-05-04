const errorHandler = {
  wrap(error, message) {
    console.log(message);
    return error;
  },
};

export default class SomeClass {
  mongodb;
  constructor(mongodb) {
    this.mongodb = mongodb;
  }
  async getAllAuthors(cb) {
    try {
      const result = await this.mongodb
        .collection('authors')
        .find({})
        .toArray();
      return cb(null, result);
    } catch (error) {
      return cb(errorHandler.wrap(error, 'while fetching all authors in the book'));
    }
  }
}
