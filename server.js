const express = require('express');
const mongoose = require('mongoose');

// Configure a new application:
const app = express();

if ( (process.env.NODE_ENV || 'development' ) === 'development' ) {
  const dotenv = require('dotenv').config();
  console.log(`Server is reporting in development mode`);
}
const DB_PATH = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}`;

// Establish the database connection:
mongoose.connect(DB_PATH, { useNewUrlParser: true });

let db = mongoose.connection;
db.once('open', () => console.log(`Connected to the database`));
db.on('error', console.error.bind(console, `MongoDB Connection Error`));

// Establish the API routes:
const router_api = require('./routes/api');
app.use('/api', router_api);

// TODO: Front-end react code will be served static:

const port = process.env.PORT || 5000;
app.listen( port, () => console.log(`Express application running on ${port}`) );