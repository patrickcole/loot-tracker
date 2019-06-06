const mongoose = require('mongoose');

let itemSchema = new mongoose.Schema({
  slug: {
    type: String,
    unique: true,
    required: true,
    dropDups: true
  },
  title: String,
  type: {
    category: String,
    system: String
  },
  locations: [
    {
      slug: String,
      date: Date,
      price: Number
    }
  ]
});

module.exports = mongoose.model('Item', itemSchema);