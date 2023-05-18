const { Schema, model } = require('mongoose');

const TravelSchema = new Schema({
  staffFirstName: {
    type: String,
    required: true,
  },
  staffLastName: {
    type: String,
    required: false,
  },
  kmTravelled: {
    type: Number,
    required: true,
  },
});

module.exports = model('travel', TravelSchema);
