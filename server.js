const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');

// If environment is development, configure environment variables:
if ( (process.env.NODE_ENV || 'development' ) === 'development' ) {
  const dotenv = require('dotenv').config();
  console.log(`Server is reporting in development mode`);
}

// Configure a new application:
const app = express();

// Apply CORS so that only those whom have access can use app:
app.use(cors());

// Apply middleware for body params:
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(helmet());

// Setup Mongoose:
const DB_PATH = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}`;

// Establish the database connection:
mongoose.connect(DB_PATH, { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false });

let db = mongoose.connection;
db.once('open', () => console.log(`Connected to the database`));
db.on('error', console.error.bind(console, `MongoDB Connection Error`));

// Establish the API routes:
const router_api = require('./routes/api');
app.use('/api', router_api);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

const port = process.env.PORT || 5000;
app.listen( port, () => console.log(`Express application running on ${port}`) );