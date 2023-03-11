const { Pool } = require('pg');
const createTableQuery = require('./tableQueries.js');

const reviews = new Pool({
  user: 'postgres',
  password: 'pass',
  host: 'localhost',
  database: 'sdc-reviews',
  port: 5432,
});

reviews.connect();

reviews.query(createTableQuery.products)
.then(() => {
  return reviews.query(createTableQuery.reviewers);
})
.then(() => {
  return reviews.query(createTableQuery.reviews);
})
.then(() => {
  return reviews.query(createTableQuery.results);
})
.then(() => {
  return reviews.query(createTableQuery.reviews_photos);
})
.then(() => {
  return reviews.query(createTableQuery.characteristics);
})
.then(() => {
  return reviews.query(createTableQuery.characteristic_reviews);
})
.catch((err) => {
  console.error(err);
})



// reviews.query(createTableQuery.results, (err, res) => {
//   if (err) {
//     console.error(err);
//   } else {
//     console.log('Created results table');
//   }
// })

// reviews.query(createTableQuery.reviews, (err, res) => {
//   if (err) {
//     console.error(err);
//   } else {
//     console.log('Created reviews table');
//   }
// })

// reviews.query(createTableQuery.reviewers, (err, res) => {
//   if (err) {
//     console.error(err);
//   } else {
//     console.log('Created reviewers table');
//   }
// })

// reviews.query(createTableQuery.results, (err, res) => {
//   if (err) {
//     console.error(err);
//   } else {
//     console.log('Created results table');
//   }
// })



module.exports = reviews;