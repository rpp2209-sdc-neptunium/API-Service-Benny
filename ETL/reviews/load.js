const { parse } = require('csv-parse');
const fs = require('fs');
const readStream = require('./extract.js');
const reviews = require('../config/db.js');
const transformRecord = require('./transform.js')

const parser = parse({
  columns: true,
});

readStream.pipe(parser);

const failedRecords = [];

parser.on('data', async (record) => {
  var record = transformRecord(record);
  if (record.id <= 2344615) {
    readStream.pause();
    parser.pause();
    parser.resume();
    readStream.resume();
    return;
  }
  var queries = [
    `INSERT INTO products (product_id) VALUES ('${record.product_id}')
      ON CONFLICT (product_id) DO NOTHING;`,
    `INSERT INTO reviewers (reviewer_name, reviewer_email) VALUES ('${record.reviewer_name}', '${record.reviewer_email}')
      ON CONFLICT (reviewer_email) DO NOTHING;`,
    `WITH new_review AS (
      INSERT INTO reviews (id, rating, date, summary, body, recommend, reported, reviewer, response, helpfulness)
      VALUES ('${record.id}', '${record.rating}', to_timestamp('${Number(record.date)}' / 1000.0), '${record.summary}', '${record.body}', '${record.recommend}', '${record.reported}', (SELECT id FROM reviewers WHERE reviewer_email = '${record.reviewer_email}'), '${record.response}', '${record.helpfulness}')
      RETURNING review_id
    )`,
    `INSERT INTO results (product_id, review_id) VALUES (
      (SELECT id FROM products WHERE product_id = '${record.product_id}'),
      (SELECT review_id FROM new_review)
    );`
  ];

  try {
    parser.pause();
    await reviews.query(`BEGIN; ${queries.join(' ')} COMMIT;`);
    console.log(record.id)
    parser.resume();
  } catch (error) {
    console.error(`skipping record bc ${error} on`, record);
    failedRecords.push(record);
    parser.resume();
  }
})

readStream.on('error', (err) => {
  console.err(err);
})

parser.on('error', (err) => {
  console.error(err);
})

readStream.on('end', () => {
  console.log('End of read stream');
})

parser.on('end', () => {
  console.log('End of stream');
  console.log(`failed records,` , JSON.stringify(failedRecords));
});



