const mongoose = require('mongoose');

let itemSchema = new mongoose.Schema({
  slug: String,
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