const express = require('express');
const app = express();

// Establish the API routes:
const router_api = require('./routes/api');

app.use('/api', router_api);

const port = process.env.PORT || 5000;
app.listen( port, () => console.log(`Express application running on ${port}`) );