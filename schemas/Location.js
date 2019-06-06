const mongoose = require('mongoose');

let locationSchema = new mongoose.Schema({
  slug: {
    type: String,
    unique: true,
    required: true,
    dropDups: true
  },
  title: String,
  coordinates: String,
});

module.exports = mongoose.model('Location', locationSchema);