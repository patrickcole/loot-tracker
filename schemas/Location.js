const mongoose = require('mongoose');

let locationSchema = new mongoose.Schema({
  slug: String,
  title: String,
  coordinates: String
});

module.exports = mongoose.model('Location', locationSchema);