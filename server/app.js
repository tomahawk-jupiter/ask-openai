const express = require('express');
const app = express();
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const indexRouter = require('./routes/posts');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const MONGODB_USERNAME = process.env.MONGODB_USERNAME;
const MONGODB_PASSWORD = process.env.MONGODB_PASSWORD;
const MONGODB_CLUSTER = process.env.MONGODB_CLUSTER;
const MONGODB_DATABASE = process.env.MONGODB_DATABASE;
const MONGO_URI = `mongodb+srv://${MONGODB_USERNAME}:${MONGODB_PASSWORD}@${MONGODB_CLUSTER}.psiey.mongodb.net/${MONGODB_DATABASE}?retryWrites=true&w=majority`;

// Connect to DB
if (!process.env.TEST) {
  mongoose.set('strictQuery', false); // avoid the deprecation warning
  mongoose.connect(MONGO_URI, () => {
    console.log('Connected to MongoDB');
  });
}

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use(helmet()); // uses the helmet defaults

app.use('/', indexRouter);

module.exports = app;
