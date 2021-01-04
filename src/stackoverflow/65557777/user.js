const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const widgetSchema = new Schema({
  city: {
    type: String,
  },
});

const userSchema = new Schema({
  name: {
    type: String,
  },
  password: {
    type: String,
  },
  widgets: [widgetSchema],
});

const User = mongoose.model('user', userSchema);

module.exports = User;
