const mongoose = require('mongoose');

let itemSchema = new mongoose.Schema({
  slug: {
    type: String,
    unique: true,
    required: true,
    dropDups: true
  },
  title: String
});

module.exports = mongoose.model('Item', itemSchema);