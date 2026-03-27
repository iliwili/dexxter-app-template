// backend/server.js
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const routes = require('./src/routes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/', routes);

app.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`);
});
