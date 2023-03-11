const reviews = require('../../config/db.js');
const fs = require('fs');

const filePath = '/mnt/c/users/vbenn/downloads/characteristic_reviews.csv';
const copyCommand = `
  COPY characteristic_reviews (id, characteristic_id, review_id, value)
  FROM '${filePath}'
  WITH (FORMAT csv, HEADER true)
`;

reviews.query(copyCommand)
