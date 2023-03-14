var db = require('../config/db.js')

module.exports = {
  getAll: (param) => {
    const cols = ['reviews.id', 'reviews.rating', 'reviews.date',
      'reviews.summary', 'reviews.body', 'reviews.recommend', 'reviews.reported', 'reviews.response',
      'reviewers.reviewer_name', 'reviewers.reviewer_email', 'reviews.helpfulness']

    return db.query(`SELECT ${cols.join(',')}, array_agg(reviews_photos.url) AS photos
    FROM results
    INNER JOIN products ON results.product_id = products.id
    INNER JOIN reviews ON results.review_id = reviews.review_id
    INNER JOIN reviewers ON reviews.reviewer = reviewers.id
    LEFT JOIN reviews_photos ON reviews_photos.review_id = reviews.id
    WHERE products.product_id = ${param.product_id}
    GROUP BY ${cols.join(', ')}
    ORDER BY ${param.sort} DESC Limit ${param.limit};`)
  }
}

// SELECT reviews.id, reviews.rating, reviews.date, reviews.summary, reviews.body, reviews.recommend, reviews.reported, reviews.response, reviewers.reviewer_name, reviewers.reviewer_email, reviews.helpfulness, array_agg(reviews_photos.url)
//   FROM results
//   INNER JOIN products ON results.product_id = products.id
//   INNER JOIN reviews ON results.review_id = reviews.review_id
//   INNER JOIN reviewers ON reviews.reviewer = reviewers.id
//   LEFT JOIN reviews_photos ON reviews_photos.review_id = reviews.id
//   WHERE products.product_id = 2
//   GROUP BY reviews.id, reviews.rating, reviews.date, reviews.summary, reviews.body, reviews.recommend, reviews.reported, reviews.response, reviewers.reviewer_name, reviewers.reviewer_email, reviews.helpfulness
//   ORDER BY helpfulness DESC Limit 10;