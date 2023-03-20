const db = require('../config/db.js')
const transformRecord = require('./utils/transformRecord.js');
const formatRatings = require('./utils/formatRatings.js');
const characteristics = require('./characteristics.js');

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
        reviews.rating`);

      data.rows.forEach(row => {
        ratings[row.rating] = row.count;
      })
      ratings = formatRatings(ratings);
      return ratings;
    } catch (err) {
      console.error('in getRatings', err);
      return err;
    }
  },

  post: async (record) => {
    var record = transformRecord(record);
    var queries = [
      `INSERT INTO products (product_id) VALUES ('${record.product_id}')
      ON CONFLICT (product_id) DO NOTHING;`,
      `INSERT INTO reviewers (reviewer_name, reviewer_email) VALUES ('${record.name}', '${record.email}')
      ON CONFLICT (reviewer_email) DO NOTHING;`,
      `INSERT INTO reviews (id, rating, date, summary, body, recommend, reported, reviewer, response, helpfulness)
      VALUES ('0', '${record.rating}', to_timestamp('${Number(record.date)}' / 1000.0), '${record.summary}', '${record.body}', '${record.recommend}', '${record.reported}',
      (SELECT id FROM reviewers WHERE reviewers.reviewer_email = '${record.email}'), '${record.response}', '${record.helpfulness}')
      RETURNING review_id;`
    ];

    try {
      var review_id = (await db.query(`BEGIN; ${queries.join(' ')} COMMIT;`))[3].rows[0].review_id;
      await db.query(`INSERT INTO results (product_id, review_id) VALUES (
        (SELECT id FROM products WHERE product_id = '${record.product_id}'),
        '${review_id}'
      );`);
      await Promise.all(record.photos.map((url) => {
        return db.query(`INSERT INTO reviews_photos (review_id, url) VALUES (
          '${review_id}',
          '${url}'
        );`);
      }))
      await characteristics.post(record, review_id);
      return 'POST success';
    } catch (error) {
      console.error(error);
      return error;
    }
  },

  updateHelpful: (review_id) => {
    return db.query(`UPDATE reviews
    SET helpfulness = helpfulness + 1
    WHERE review_id = '${review_id}'
    ;`);
  },

  report: (review_id) => {
    return db.query(`UPDATE reviews
    SET reported = true
    WHERE review_id = '${review_id}'
    ;`);
  }
}