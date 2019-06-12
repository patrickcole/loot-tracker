const mongoose = require('mongoose');

let listingSchema = new mongoose.Schema({
  _id: mongoose.Schema.ObjectId,
  item: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  price: mongoose.Decimal128
});

module.exports = mongoose.model('Listing', listingSchema);