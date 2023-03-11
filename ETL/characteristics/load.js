const reviews = require('../../config/db.js');
const fs = require('fs');

const filePath = '/mnt/c/users/vbenn/downloads/characteristics.csv';
const copyCommand = `
  COPY characteristics (id, product_id, name)
  FROM '${filePath}'
  WITH (FORMAT csv, HEADER true)
`;

reviews.query(copyCommand);