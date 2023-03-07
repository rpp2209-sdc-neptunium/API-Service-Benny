require("dotenv").config();
const express = require('express')
const app = express();
const port = process.env.PORT || 8080;

// =============================================
//                Middleware
// =============================================
app.use(express.json());

// =============================================
//               Route Imports
// =============================================

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});