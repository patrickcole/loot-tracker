const express = require('express');

// Create router to handle requests:
const router = express.Router();

// Get Schemas:
const Location = require('../schemas/Location');
const Item = require('../schemas/Item');

// Utils:
const APIResponse = require('./util/APIResponse');

router.get('/locations', (req, res) => {
  Location.find( (err, data ) => { 
    APIResponse(res, err, data, 'Locations not found');
  })
});

router.post('/locations', (req, res) => {

  // TODO: Santize data:
  let location = new Location(req.body);
  location
    .save()
    .then( item => res.json({ success: true , message: 'Location saved' }))
    .catch( err => res.json({ success: false, message: err }));
});

router.get('/location/:slug', (req, res) => {
  Location.findOne( { slug: req.params.slug }, ( err, data ) => {
    APIResponse(res, err, data, 'Location not found');
  });
})

router.get('/items', (req, res) => {
  Item.find( (err, data) => {
    APIResponse(res, err, data, 'Items not found');
  })
});

router.post('/items', (req, res) => {

  // TODO: Santize data:
  let item = new Item(req.body);
  item
    .save()
    .then( item => res.json({ success: true, message: 'Item Added' }))
    .catch( err => res.json({ success: false, message: err }));
});

router.get('/item/:slug', (req, res) => {
  Item.findOne( { slug: req.params.slug }, ( err, data ) => {
    APIResponse(res, err, data, 'Item not found')
  });
})

router.post('/listing/:slug', (req, res) => {

  let query = { slug: req.params.slug };
  let update = { '$push': { 'locations': req.body } };

  Item.findOneAndUpdate(query, update, ( err, data ) => {
    APIResponse(res, err, data, 'Item not updated')
  });
});

router.delete('/listing/:slug', (req, res) => {

  let query = { slug: req.params.slug };
  let update = { '$pull': { 'locations': req.body } };

  Item.findOneAndUpdate(query, update, (err, data) => {
    APIResponse(res, err, data, 'Listing not removed');
  })
});

module.exports = router;