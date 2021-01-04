const express = require('express');
const app = express();
const mongoose = require('mongoose');
const { config } = require('../../config');

(async () => {
  try {
    await mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  } catch (err) {
    console.log('error: ' + err);
    process.exit(1);
  }
  console.log('this should run after successfull connection');
  // app.use(...)
  app.listen(process.env.PORT, () => {
    console.log('listening');
  });
})();
