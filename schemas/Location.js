const mongoose = require('mongoose');

let locationSchema = new mongoose.Schema({
  slug: {
    type: String,
    unique: true,
    required: true,
    dropDups: true
  },
  title: String,
  latlng: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  }
});

module.exports = mongoose.model('Location', locationSchema);