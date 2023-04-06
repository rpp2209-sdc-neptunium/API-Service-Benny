require("dotenv").config();
const express = require('express')
const app = express();
const port = process.env.PORT || 8080;
const router = require('./routes.js');
const logger = require('./logger.js');
const path = require('path');

// =============================================
//                Middleware
// =============================================
app.use(express.json());
app.use(logger);
app.use(express.static(path.join(__dirname, 'dist')));

// =============================================
//               Route Imports
// =============================================

app.use('/', router)

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});