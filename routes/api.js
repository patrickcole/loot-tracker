const express = require('express');
const mongoose = require('mongoose');

// Create router to handle requests:
const router = express.Router();

// Get Schemas:
const Location = require('../schemas/Location');
const Item = require('../schemas/Item');

router.get('/locations', (req, res) => {
  Location.find( (err, data ) => {
    if ( err ) return res.json({ success: false, error: err });
    return res.json({ success: true, data: data });
  });
});

router.get('/location/:slug', (req, res) => {
  return res.json({ success: true, data: { message: req.params.slug } } );
})

router.get('/items', (req, res) => {
  Item.find( (err, data ) => {
    if ( err ) return res.json({ success: false, error: err });
    return res.json({ success: true, data: data });
  });
});

router.get('/item/:slug', (req, res) => {
  return res.json({ success: true, data: { message: req.params.slug } } );
})

module.exports = router;