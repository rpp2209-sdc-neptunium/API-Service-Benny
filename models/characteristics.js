var db = require('../config/db.js')

module.exports = {
  get: async (param) => {
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

  post: async (record, review_id, dbs = db) => {
    try {
      var queries = [];
      for (const key of Object.keys(record.characteristics)) {
        let characteristic = key;
        let value = record.characteristics[key];
        let query = `INSERT INTO characteristic_reviews (characteristic_id, review_id, value)
        VALUES ('${key}', '${review_id}', '${value}');`
        queries.push(query);
      }
      return dbs.query(`BEGIN; ${queries.join(' ')} COMMIT;`);
    } catch (error) {
      console.error(error);
      return 'error';
    }
  }
}