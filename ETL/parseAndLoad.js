const { parse } = require('csv-parse');
const fs = require('fs');
const readStream = require('./extract.js');
const reviews = require('../config/db.js');
const transformRecord = require('./transform.js')

const parser = parse({
  columns: true,
});
var currentLineCount = 0;
const totalBytes = fs.statSync('/home/benny/hackreactor/systems-design-capstone/reviews.csv').size;
var bytesRead = 0;
const thresholdBytes = 200000000; // set threshold to 100 bytes
let bytesRemaining = totalBytes;

readStream.pipe(parser);

parser.on('data', (record) => {
  var record = transformRecord(record);
  reviews.query(`INSERT INTO products (product_id) VALUES ('${record.product_id}')
    ON CONFLICT (product_id) DO NOTHING;`)
    .then(() => {
      return reviews.query(`INSERT INTO reviewers (reviewer_name, reviewer_email) VALUES ('${record.reviewer_name}', '${record.reviewer_email}')
      ON CONFLICT (reviewer_email) DO NOTHING;`)
    })
    .then(() => {
      return reviews.query(`INSERT INTO reviews (rating, date, summary, body, recommend, reported, reviewer, response, helpfulness)
      VALUES ('${record.rating}', to_timestamp('${Number(record.date)}' / 1000.0), '${record.summary}', '${record.body}', '${record.recommend}', '${record.reported}', (SELECT id FROM reviewers WHERE reviewer_email = '${record.reviewer_email}'), '${record.response}', '${record.helpfulness}')
      RETURNING review_id;`)
    })
    .then((res) => {
      var review_id = res.rows[0].review_id;
      reviews.query(`INSERT INTO results (product_id, review_id)
      VALUES (
        (SELECT id FROM products WHERE product_id = '${record.product_id}'),
        ${review_id}
      )`)
      return;
    })
    .catch((err) => {
      console.error(`skipping record bc ${err} on`, record);
    })
  // currentLineCount++;

  // if (currentLineCount >= 10) {
  //   readStream.destroy();
  //   parser.destroy();
  //   console.log('cone', currentLineCount, record);
  // }
})

readStream.on('err', (err) => {
  console.err(err);
})

// readStream.on('data', (chunk) => {
//   bytesRead += chunk.length;
//   // check if we've reached the threshold
//   if (bytesRead >= thresholdBytes) {
//     bytesRemaining -= chunk.length;
//     console.log(`${bytesRemaining} bytes remaining`);
//     bytesRead = 0;
//   }
// });

parser.on('error', (err) => {
  console.error(err);
})

parser.on('end', () => {
  console.log('End of stream');
});



