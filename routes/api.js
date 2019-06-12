const express = require('express');

// Create router to handle requests:
const router = express.Router();

// Get Schemas:
const Item = require('../schemas/Item');
const Listing = require('../schemas/Listing');
const Location = require('../schemas/Location');

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
  Location.aggregate([
    { $match: { slug: req.params.slug } },
    {
      $lookup:
        {
          from: "listings",
          localField: "slug",
          foreignField: "location",
          as: "listings"
        }
    },
    {
      $unwind: { path: "$listings", preserveNullAndEmptyArrays: true }
    },
    {
      $lookup: 
      {
        from: "items",
        localField: "listings.item",
        foreignField: "slug",
        as: "details"
      }
    },
    {
      $unwind: { path: "$details", preserveNullAndEmptyArrays: true }
    },
    {
      $group:{
        _id:"$_id",
        slug: {$first: "$slug"},
        title: {$first: "$title"},
        latlng: {$first: "$latlng"},
        products: {
          $push: {
            $cond: [
              { $gt:[ "$listings", {} ] },
              {
                _id: "$listings._id",
                "item": "$listings.item",
                "price": "$listings.price",
                "date": "$listings.date",
                "title": "$details.title"
              },
              { 
                "price": "No Price",
                "location": "default",
                "date": "no date",
                "title": "no title"
              }
            ]
          }
        }
      }
    },
    {
      $project : {
        slug: 1,
        title: 1,
        latlng: 1,
        products : { $filter : { input : "$products", as : "item", cond : { $ne : ["$$item.location" , "default"] } } }
      }
    }
  ], (err, data) => {
    APIResponse(res, err, data, 'Location not found', 'Location was found');
  })
});

router.put('/location/:slug', (req, res) => {

  let query = { slug: req.params.slug };
  Location.findOneAndUpdate(query, req.body, { new: true }, ( err, data ) => {
    APIResponse(res, err, data, 'Location not updated', 'Location was updated');
  })
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
  Item.aggregate([
    { $match: { slug: req.params.slug } },
    {
      $lookup:
        {
          from: "listings",
          localField: "slug",
          foreignField: "item",
          as: "listings"
        }
    },
    {
      $unwind: { path: "$listings", preserveNullAndEmptyArrays: true }
    },
    {
      $lookup: 
      {
        from: "locations",
        localField: "listings.location",
        foreignField: "slug",
        as: "details"
      }
    },
    {
      $unwind: { path: "$details", preserveNullAndEmptyArrays: true }
    },
    {
      $group:{
        _id:"$_id",
        slug: {$first: "$slug"},
        title: {$first: "$title"},
        products: {
          $push: {
            $cond: [
              { $gt:[ "$listings", {} ] },
              {
                _id: "$listings._id",
                "location": "$listings.location",
                "price": "$listings.price",
                "date": "$listings.date",
                "title": "$details.title"
              },
              { 
                "price": "No Price",
                "location": "default",
                "date": "no date",
                "title": "no title"
              }
            ]
          }
        }
      }
    },
    {
      $project : {
        slug: 1,
        title: 1,
        products : { $filter : { input : "$products", as : "item", cond : { $ne : ["$$item.location" , "default"] } } }
      }
    }
  ], (err, data) => {
    APIResponse(res, err, data, 'Item not found', 'Item was found');
  });
});

router.put('/item/:slug', (req, res) => {

  let query = { slug: req.params.slug };
  Item.findOneAndUpdate(query, req.body, { new: true }, ( err, data ) => {
    APIResponse(res, err, data, 'Item not updated', 'Item was updated');
  })
})

router.post('/listings', (req, res) => {

  // TODO: Santize data:
  let item = new Listing(req.body);
  item
    .save()
    .then( listing => res.json({ success: true, message: 'Listing Added' }))
    .catch( err => res.json({ success: false, message: err }));
});

router.delete('/listings', (req, res) => {

  Listing.findByIdAndDelete(req.body._id,(err, data) => {
    APIResponse(res, err, data, 'Listing not removed', 'Listing removed');
  })
});

module.exports = router;