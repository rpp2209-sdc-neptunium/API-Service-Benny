const { Pool } = require('pg');
const models = require('../models/index.js');
const jest = require('jest');

let db;
let connection =
  beforeAll(async () => {
    db = new Pool({
      user: 'postgres',
      password: 'pass',
      host: 'localhost',
      database: 'sdc-reviews',
      port: 5432,
    });
    connection = await db.connect();
  })

afterAll(async () => {
  await connection.end();
});

/* INTEGREATION TESTS */
describe("Speed Tests - Reviews", () => {
  const params = {
    limit: 10,
    product_id: 71599,
    sort: 'helpfulness'
  }

  it("Should get print execute get request for a single product_id under 50ms", async () => {
    var start = performance.now();
    try {
      await models.reviews.getAll(params, db)
      var results = performance.now() - start;
      console.log(`Time under ${results}`);
      expect(results).toBeLessThan(50);
    } catch (err) {
      console.error(err);
    }
  })
});

