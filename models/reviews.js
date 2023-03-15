var db = require('../config/db.js')

module.exports = {
  getAll: (param) => {
    const cols = ['reviews.review_id', 'reviews.rating', 'reviews.date',
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
  },

  getCharacteristics: async (param) => {
    var characteristics = {};
    try {
      var data = await db.query(`SELECT characteristics.id, characteristics.name, AVG(characteristic_reviews.value) as value from characteristic_reviews
      INNER JOIN characteristics ON characteristic_reviews.characteristic_id = characteristics.id
      WHERE characteristics.product_id = ${param.product_id}
      GROUP BY characteristics.name, characteristics.id;`);

      data.rows.forEach(row => {
        characteristics[row.name] = {
          id: row.id,
          value: row.value
        }
      })
      return characteristics;
    } catch (err) {
      console.error('in get char', err);
      return err;
    }
  },

  getRecommend: async (param) => {
    var recommend = {};

    try {
      var data = await db.query(`SELECT
        SUM(CASE WHEN reviews.recommend THEN 1 ELSE 0 END) AS true,
        SUM(CASE WHEN NOT reviews.recommend THEN 1 ELSE 0 END) AS false
      FROM
        results
        INNER JOIN products ON results.product_id = products.id
        INNER JOIN reviews ON results.review_id = reviews.review_id
      WHERE
        products.product_id = ${param.product_id}`);

      data.rows.forEach(row => {
        recommend.true = row.true;
        recommend.false = row.false;
      })

      return recommend;
    } catch (err) {
      console.error('in getRecommend', err);
      return err;
    }
  },

  getRatings: async (param) => {
    var ratings = {};

    try {
      var data = await db.query(`SELECT
        reviews.rating,
        COUNT(*) as count
      FROM
        results
        INNER JOIN products ON results.product_id = products.id
        INNER JOIN reviews ON results.review_id = reviews.review_id
      WHERE
        products.product_id = 2
      GROUP BY
        reviews.rating`)

      data.rows.forEach(row => {
        ratings[row.rating] = row.count;
      })

      return ratings;
    } catch (err) {
      console.error('in getRatings', err);
      return err;
    }
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

// SELECT
//   SUM(CASE WHEN reviews.recommend THEN 1 ELSE 0 END) AS true,
//   SUM(CASE WHEN NOT reviews.recommend THEN 1 ELSE 0 END) AS false
// FROM
//   results
//   INNER JOIN products ON results.product_id = products.id
//   INNER JOIN reviews ON results.review_id = reviews.review_id
// WHERE
//   products.product_id = 2;