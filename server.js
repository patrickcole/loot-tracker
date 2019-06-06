const express = require('express');
const app = express();

// Establish the API routes:
const routerAPI = express.Router();
app.use('/api', routerAPI);

routerAPI.get('/locations', (req, res) => {
  return res.json({ success: true, data: { message: "Locations Full List" } });
});

routerAPI.get('/items', (req, res) => {
  return res.json({ success: true, data: { message: "Items Full List" } } );
});

const port = process.env.PORT || 5000;
app.listen( port, () => console.log(`Express application running on ${port}`) );