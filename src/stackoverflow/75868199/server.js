const express = require('express');
const userController = require('./user.controller');

const app = express();

app.use(express.json())
app.post('/api/getUser', userController.getUser)

module.exports = app;