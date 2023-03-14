
var models = require('../models/index.js');

module.exports = {
  get: (req, res) => {
    console.log(req.query);
    req.query.page = req.query.page || 1;
    req.query.count = req.query.count || 5;
    req.query.limit = req.query.count * req.query.page;
    models.reviews.getAll(req.query)
    .then((data) => {
      res.status(201).json(data.rows);
    })
    .catch((err) => {
      console.error(err);
      res.status(401);
    })
  }
};