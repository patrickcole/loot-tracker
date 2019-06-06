const express = require('express');
const router = express.Router();

router.get('/locations', (req, res) => {
  return res.json({ success: true, data: { message: "Locations Full List" } });
});

router.get('/location/:slug', (req, res) => {
  return res.json({ success: true, data: { message: req.params.slug } } );
})

router.get('/items', (req, res) => {
  return res.json({ success: true, data: { message: "Items Full List" } } );
});

router.get('/item/:slug', (req, res) => {
  return res.json({ success: true, data: { message: req.params.slug } } );
})

module.exports = router;