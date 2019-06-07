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
      date: {
        type: Date,
        default: Date.now
      },
      price: mongoose.Decimal128
    }
  ]
});

module.exports = mongoose.model('Item', itemSchema);