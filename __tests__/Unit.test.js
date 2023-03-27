const { Pool } = require('pg');
const models = require('../models/index.js');
const jest = require('jest');
const transformRecord = require('../models/utils/transformRecord.js')

let db;
let connection =
  beforeAll(async () => {
    db = new Pool({
      user: 'postgres',
      password: 'pass',
      host: 'localhost',
      database: 'sdc_reviews_test',
      port: 5432,
    });
    connection = await db.connect();
  })

afterAll(async () => {
  await connection.end();
});

/* UNIT TESTS */
describe("Unit Tests - Reviews", () => {
  const params = {
    limit: 10,
    product_id: 2,
    sort: 'helpfulness'
  }
  it("should get correct format for reviews for a single proudct_id", async () => {
    const params = {
      limit: 10,
      product_id: 2,
      sort: 'helpfulness DESC, date DESC'
    }
    var results = await models.reviews.getAll(params);
    expect(results.rows.length).toBeGreaterThan(0);
    var review = results.rows[0]
    expect(review).toHaveProperty("review_id");
    expect(review).toHaveProperty("rating");
    expect(review).toHaveProperty("summary");
    expect(review).toHaveProperty("recommend");
    expect(review).toHaveProperty("response");
    expect(review).toHaveProperty("body");
    expect(review).toHaveProperty("date");
    expect(review).toHaveProperty("reviewer_name");
    expect(review).toHaveProperty("helpfulness");
    expect(review).toHaveProperty("photos");
  });

  it("should get correct format for recommended count for a product_id", async () => {
    var results = await models.reviews.getRecommend(params);
    expect(results).toHaveProperty("true");
    expect(results).toHaveProperty("false");
  })

  it("should get correct format for recommended count for a product_id", async () => {
    var results = await models.reviews.getRecommend(params);
    expect(results).toHaveProperty("true");
    expect(results).toHaveProperty("false");
  })


  it("should get correct format for ratings for a product_id", async () => {
    var results = await models.reviews.getRatings(params);
    expect(results).toHaveProperty("1");
    expect(results).toHaveProperty("2");
    expect(results).toHaveProperty("3");
    expect(results).toHaveProperty("4");
    expect(results).toHaveProperty("5");
  })

  it("should post a ratings for a product_id", async () => {
    var date = new Date().getTime();
    var record = {
      "product_id": 2,
      "rating": 5,
      "date": new Date().getTime(),
      "summary": "this is a test",
      "body": "this is also a test",
      "recommend": true,
      "name": "tester",
      "email": "test@test.com",
      "photos": ["test1", "test2"],
      "characteristics": {
        "1": 1
      }
    };

    record = transformRecord(record);

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
      var beforeReviews = await db.query('SELECT COUNT(*) FROM reviews;');
      var beforePhotos = await db.query('SELECT COUNT(*) FROM reviews_photos;');
      var beforeCharacteristics = await db.query('SELECT COUNT(*) FROM characteristic_reviews;');

      var review_id = (await db.query(`BEGIN; ${queries.join(' ')} COMMIT;`))[3].rows[0].review_id;
      await db.query(`INSERT INTO results (product_id, review_id) VALUES (
        (SELECT id FROM products WHERE product_id = '${record.product_id}'),
        '${review_id}'
      );`);
      record.photos.forEach(async (url) => {
        await db.query(`INSERT INTO reviews_photos (review_id, url) VALUES (
          '${review_id}',
          '${url}'
        );`);
      })
      await models.characteristics.post(record, review_id, db);

      var afterReviews = await db.query('SELECT COUNT(*) FROM reviews;');
      var afterPhotos = await db.query('SELECT COUNT(*) FROM reviews_photos;');
      var afterCharacteristics = await db.query('SELECT COUNT(*) FROM characteristic_reviews;');

    } catch (err) {
      console.error(err);
    }

    expect(Number(beforePhotos.rows[0].count)).toEqual(Number(afterPhotos.rows[0].count) - 2);
    expect(Number(beforeReviews.rows[0].count)).toEqual(Number(afterReviews.rows[0].count) - 1);
    expect(Number(beforeCharacteristics.rows[0].count)).toEqual(Number(afterCharacteristics.rows[0].count) - 1);
  });
});

describe("Unit Tests - Characteristics", () => {
  it("should get correct format for characteristics for a product_id", async () => {
    let params = {
      limit: 10,
      product_id: 2,
      sort: 'helpfulness'
    }
    try {
      var results = await models.characteristics.get(params);
      expect(results).toHaveProperty("Quality");
      expect(results.Quality).toHaveProperty("id", 5);
      expect(results.Quality).toHaveProperty("value");
    } catch (err) {
      console.error(err);
    }
  });
});