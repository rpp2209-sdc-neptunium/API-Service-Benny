const reviews = require('../../config/db.js');
const fs = require('fs');

const filePath = '/mnt/c/users/vbenn/downloads/reviews_photos.csv';
const copyCommand = `
  COPY reviews_photos (id, review_id, url)
  FROM '${filePath}'
  WITH (FORMAT csv, HEADER true, FORCE_NULL(review_id))
`;

reviews.query(copyCommand);