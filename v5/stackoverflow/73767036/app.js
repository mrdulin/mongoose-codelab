const express = require('express');
const TravelUsage = require('./models/travel_usage');

const app = express();

app.use(express.json());
app.post('/travelUsage', function (req, res) {
  try {
    var data = {
      staffFirstName: req.body.staffFirstName,
      staffLastName: req.body.staffLastName,
      kmTravelled: req.body.kmTravelled,
    };
    var travelUsage = new TravelUsage(data);
    travelUsage.save();
    return res.status(201).json(data);
  } catch (error) {
    console.log(error.message);
    return res.status(400).json({ message: error.message });
  }
});

module.exports = app;
