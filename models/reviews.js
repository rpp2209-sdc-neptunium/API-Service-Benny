var db = require('../config/db.js')

module.exports = {
  getAll: (param) => {
    return db.query(`SELECT products.product_id, reviews.*
    FROM results
    INNER JOIN products ON results.product_id = products.id
    INNER JOIN reviews ON results.review_id = reviews.review_id
    WHERE products.product_id = ${param.product_id}
    ORDER BY ${param.sort} DESC Limit ${param.limit};`)
  }
}
